export class UploadFile {
 File: File;
  constructor() { }
}

export class File {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
  constructor() { }
}
