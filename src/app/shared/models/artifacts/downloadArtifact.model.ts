
export class DownloadArtifactModel {
  downloadOption: string;
  projectName: string;
  projectId: string;
  efforts: number;


  constructor(downloadartifact: any = null) {
    this.downloadOption = 'project';
    this.projectName = downloadartifact ? downloadartifact.projectName : '';
    this.projectId = downloadartifact ? downloadartifact.projectId : '';
    this.efforts = downloadartifact ? downloadartifact.efforts : '';
  }
}
