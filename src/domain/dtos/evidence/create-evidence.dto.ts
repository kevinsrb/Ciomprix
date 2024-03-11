import { regularExps } from "../../../config";
import { FormatFile } from "../../../data";

export class CreateEvidenceDto {

  private constructor(
    public readonly filename: string,
    public readonly size: number,
    public readonly format: FormatFile,
    public readonly subject: string,
  ) {}


  static create( object: { [key: string]: any } ):[string?, CreateEvidenceDto?] {

    const { filename, size, format, subject } = object;

    if ( !filename ) return ['Missing filename'];
    if ( !size ) return ['Missing size'];
    if ( !format ) return ['Missing format'];
    if ( !subject ) return ['Missing subject'];
    if ( !regularExps.uuidv4.test( subject ) ) return ['subject is not uuid'];
    

    return [undefined, new CreateEvidenceDto(filename, size, format, subject)];

  }


}



