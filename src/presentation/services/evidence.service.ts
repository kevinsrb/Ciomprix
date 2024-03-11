import * as path from 'path';
import * as fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Evidence, FormatFile, User,  } from '../../data';
import { CreateEvidenceDto, CustomError } from '../../domain';
import { Subject } from '../../data/postgres/entities/Subject.entity';
import { UpdateEvidenceDto } from '../../domain/dtos/evidence/update-evidence.dto';


export class EvidenceService {

  // DI
  constructor() { }


  async createEvidence( file: UploadedFile, createEvidenceDto: CreateEvidenceDto, subject: Subject, user: User, folder: string = 'uploads'  ) {

    try {

      const userId = user.id;
      const subjectId = subject.id;
      const period = subject.period;

      const count = await Evidence.createQueryBuilder('evidence')
      .leftJoin('evidence.user', 'user')
      .leftJoin('evidence.subject', 'subject')
      .where('user.id = :userId', { userId: userId })
      .andWhere('subject.id = :subjectId', { subjectId: subjectId })
      .andWhere('subject.period = :period', { period: period })
      .getCount();


      if (count >= 5) {
        throw CustomError.badRequest('El usuario ya tiene 5 evidencias asociadas a esta asignatura en este período');
      }

    
      this.createFile(file, folder, createEvidenceDto.filename )
    
      const evidence = new Evidence();
      evidence.filename = createEvidenceDto.filename;
      evidence.size = createEvidenceDto.size;
      evidence.format = createEvidenceDto.format;
      evidence.subject = subject;
      evidence.user = user;
      await evidence.save();

      return evidence;
     

    } catch ( error ) {
      console.log(error)
      throw CustomError.internalServer( `${ error }` );
    }

  }


  public async getEvidenceById(id: string){
    return await Evidence.findOneByOrFail({id});
  }

  public async updateEvidence(id: string, file: UploadedFile, updateEvidenceDto: UpdateEvidenceDto, folder: string = 'uploads' ){
  
    const evidence = await this.getEvidenceById(id)
    this.deleteFile(folder, evidence.filename)
    const resp = await Evidence.update({id}, updateEvidenceDto);
    if(resp.affected! > 0) {
      this.createFile(file, folder, evidence.filename )
      return await this.getEvidenceById(id);
    }
    // throw CustomError.internalServer(`Error inesperado al actualizar el usuario con id ${id}` );
  }

  public async deleteEvidence(id: string){
    const evidence = await Evidence.findOneByOrFail({id});
    evidence.active = false;
    evidence.save()
    return evidence;
  }

  public async getEvidencesOrderByEmailAndCreateDate(){
    try {
      const evidences = await Evidence
        .createQueryBuilder('evidence')
        .leftJoinAndSelect('evidence.user', 'user')
        .orderBy('user.email')
        .addOrderBy('evidence.createdAt')
        .getMany();
  
      return evidences;
    } catch (error) {
      console.error('Error al obtener las evidencias:', error);
      throw error;
    }
  }

  public async getEvidencesForSubject(){
    try {
      const countforSubject = await Evidence.createQueryBuilder('evidence')
      .innerJoin('evidence.subject', 'subject')
      .select('subject.id', 'id')
      .addSelect('subject.name', 'name')
      .addSelect('COUNT(evidence.id)', 'totalEvidencias')
      .groupBy('subject.id')
      .getRawMany();
  
      return countforSubject;
    } catch (error) {
      console.error('Error al obtener las evidencias por asignatura:', error);
      throw error;
    }
  }


  public async getEvidences() {
      return await Evidence.find()
  }

  public async getPercentageOfEvidencesByFileType() {
    try {
        const [evidences, totalCount] = await Evidence.findAndCount();
        const formatCounts = await Evidence.createQueryBuilder('evidence')
            .select('evidence.format', 'format')
            .addSelect('COUNT(evidence.id)', 'count')
            .groupBy('evidence.format')
            .getRawMany();

        const percentagesByFileType: Record<FormatFile, number> = {
          [FormatFile.PNG]: 0,
          [FormatFile.JPG]: 0,
          [FormatFile.JPEG]: 0,
          [FormatFile.PDF]: 0
        };

        formatCounts.forEach(formatCount => {
            const format = formatCount.format as FormatFile;
            const count = parseInt(formatCount.count);
            const percentage = (count / totalCount) * 100;
            percentagesByFileType[format] = parseFloat(percentage.toFixed(2));
        });

        return percentagesByFileType;
    } catch (error) {
        console.error('Error al obtener el porcentaje de evidencias por tipo de archivo:', error);
        throw error; // Reenviar el error para manejarlo en el lugar donde se llame a esta función
    }
}

  private createFile(file: UploadedFile, folder: string, filename: string ){
    const validExtensions: string[] = Object.values(FormatFile);

    const fileExtension = file.mimetype.split('/').at(1) ?? '';
    if ( !validExtensions.includes(fileExtension) ) {
      throw CustomError
        .badRequest(`Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`);
    }

    const destination = path.resolve( __dirname, '../../../', folder );
    this.checkFolder( destination );

    file.mv(`${destination}/${ filename }`);
  }

  

  private deleteFile(folder: string, filename: string){
    fs.unlink( path.resolve( __dirname, '../../../', `${folder}/${filename}` ), (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
        return;
      }
      console.log('Archivo eliminado correctamente.');
    });
  }


  private checkFolder( folderPath: string ) {
    if ( !fs.existsSync(folderPath) ) {
      fs.mkdirSync(folderPath);
    }
  }

}


