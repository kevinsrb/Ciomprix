import { regularExps } from "../../../config";
import { FormatFile } from "../../../data";

export class UpdateEvidenceDto {

  private constructor(
    public readonly filename: string,
    public readonly size: number,
    public readonly format: FormatFile,
  ) {}


  static update( object: { [key: string]: any } ):[string?, UpdateEvidenceDto?] {

    const { filename, size, format, subject } = object;

    if ( !filename ) return ['Missing filename'];
    if ( !size ) return ['Missing size'];
    if ( !format ) return ['Missing format'];
    // if ( !subject ) return ['Missing subject'];
    // if ( !regularExps.uuidv4.test( subject ) ) return ['subject is not uuid'];
    
    return [undefined, new UpdateEvidenceDto(filename, size, format)];

  }


}



