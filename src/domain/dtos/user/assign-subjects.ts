import { regularExps } from '../../../config';
import { Subject } from '../../../data';




export class AssingSubjectsDto {

  private constructor(
    public subjects: Subject[],
  ) {}

  static assingSubject( object: { [key:string]:any } ): [string?, AssingSubjectsDto?] {
    const { subjects } = object;

    if ( subjects.length === 0 ) return ['Missing subjects'];


    return [undefined, new AssingSubjectsDto(subjects)];

  }


}