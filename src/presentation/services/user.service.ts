import { CustomError } from "../../domain";
import { Subject, User, UserRole } from "../../data";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";

export class UserService {
  constructor() {}


  public async getUsers(){
    const users = await User.find();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...restUser } = user;
      return restUser;
    });

    return usersWithoutPasswords;
  }

  public async getStudentsOrderByLastname(){
    const users = await User.find({
      where: {
        role: UserRole.STUDENT
      },
      order: {
        lastname: 'ASC'
      }
    });

    const usersWithoutPasswords = users.map(user => {
      const { password, ...restUser } = user;
      return restUser;
    });

    return usersWithoutPasswords;
  }

  public async getUserById(id: string){
    const user = await User.findOneByOrFail({id});
    const { password, ...restUser } = user;
    return restUser;
  }

  public async getUserCompleteById(id: string){
   return await User.findOneByOrFail({id});
  }

  public async getCountStudent(){
    try {
      const count = await User.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.STUDENT }) 
      .getCount();

      return count;
    } catch (error) {
      console.error('Error al contar estudiantes:', error);
      throw error;
    }
  }

  public async getStudentForMoreEvidences(){
    try {
      const count = await User.createQueryBuilder()
      .select('user.id', 'userId')
      .addSelect('user.name', 'name')
      .addSelect('COUNT(evidence.id)', 'count')
      .from(User, 'user')
      .leftJoin('user.evidences', 'evidence')
      .groupBy('user.id')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

      return count;
    } catch (error) {
      console.error('Error al contar estudiantes:', error);
      throw error;
    }
  }
  

  public async updateUser(id: string, updateUserDto: UpdateUserDto){
  
    await this.getUserById(id)
    const resp = await User.update({id}, updateUserDto);
    if(resp.affected! > 0) {
      return await this.getUserById(id);
    }
    throw CustomError.internalServer(`Error inesperado al actualizar el usuario con id ${id}` );
  }

  public async deleteUser(id: string){
  
    const user = await User.findOneByOrFail({id});
    user.active = false;
    user.save()
    const { password, ...restUser } = user;
    return restUser;
    
  }




  public async asssingSubject(id: string, subjects: Subject[]) {
    try {
      const user = await User.findOneBy({ id: id });
      if (!user) {
        throw CustomError.badRequest( "Este usuario no exite");
      }

      const subjectPeriods = subjects.map((subject) => subject.period);

      const userSubjectsCount = await User.createQueryBuilder("user")
        .leftJoinAndSelect("user.subject", "subject")
        .where("user.id = :id", { id })
        .andWhere("subject.period IN (:...periods)", {
          periods: subjectPeriods,
        })
        .getCount();
     
      if (userSubjectsCount + subjects.length > 5) throw CustomError.badRequest( "El usuario ya está asignado a un máximo de 5 asignaturas para este período." );

      user.subject = subjects;
      await user.save();
      const { password, ...restUser } = user;
      return restUser;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
