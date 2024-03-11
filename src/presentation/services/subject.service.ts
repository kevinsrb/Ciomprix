
import {  Evidence, Subject, User } from '../../data';
import { CreateSubjectDto, CustomError, PaginationDto } from '../../domain';
import { UpdateSubjectDto } from '../../domain/dtos/subject/update-subject.dto';
import { AssingSubjectsDto } from '../../domain/dtos/user/assign-subjects';
import { In } from 'typeorm';





export class SubjectService {


  constructor() {}

   async create( createSubjectDto: CreateSubjectDto ) {
    try {

      const existeSubject = await Subject.findOneBy( { name:createSubjectDto.name, period: createSubjectDto.period } );
      if (existeSubject) throw CustomError.badRequest('ya existe esta asignatura');

      const subject = new Subject();
      subject.name = createSubjectDto.name;
      subject.period = createSubjectDto.period;
      
      const resp = await subject.save();

      return resp;

     } catch ( error ) {
      console.log(error)
       throw CustomError.internalServer( `${ error }` );
     }
  }

  public async getSubjectByIdEstudent(id: string){
    try {
      const user = await User.findOneByOrFail({id});

        const subjects = await Evidence.createQueryBuilder()
        .relation(User, 'subjects')
        .of(user)
        .loadMany();

      if (subjects.length === 0) {
          throw CustomError.badRequest('El usuario no está asignado a ninguna asignatura.')
      }


      return subjects;;
    } catch (error) {
      console.error('Error al obtener las evidencias por asignatura:', error);
      throw error;
    }
  }

  async getByIds( assingSubjectsDto: AssingSubjectsDto ) {
    try {

      const subjects = await Subject.createQueryBuilder("subject").where({"id": In(assingSubjectsDto.subjects)}).getMany();
      if(subjects.length === 0) throw CustomError.badRequest('Nonse encontraron asignaturas');

      return subjects;

     } catch ( error ) {
       throw CustomError.internalServer( `${ error }` );
     }
  }

  public async getSubjects(){
    return await Subject.find();
  }

  public async getSubjectById(id: string){
    return await Subject.findOneByOrFail({id});
  }

  public async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto){
  
    await this.getSubjectById(id)
    const existeSubject = await Subject.findOneBy( { name:updateSubjectDto.name, period: updateSubjectDto.period } );
    if (existeSubject) throw CustomError.badRequest('ya existe esta asignatura');


    const resp = await Subject.update({id}, updateSubjectDto);
    if(resp.affected! > 0) {
      return await this.getSubjectById(id)
    }
    throw CustomError.internalServer(`Error inesperado al actualizar el usuario con id ${id}` );
  }

  public async deleteSubject(id: string){
    const subject = await Subject.findOneByOrFail({id});
    subject.active = false;
    subject.save()
    return subject;
  }

  







}


