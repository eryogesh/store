import { Artifact } from './artifacts/artifact.model';
import { Category } from './categories/category.model';

export class PostResponse {
  msg: string;
  status: boolean;
}

export class ArtifactResponse {
  public lastUnpublishedVersion: number;
  assetList: Artifact[];
  status: boolean;
}

export class UpdateArtifactResponse {
  assetId: number;
  version_number: number;
  status: string;
}

export class ArtifactSearchResponse {
  categories: Category[];
  project_results: Artifact[];
  totalCount: number;
}

export class UploadArtifactResponse {
  assetId: string;
  filePath: string;
  uploadProjectFiles: string;
  versionNo: string;
}

export class UploadArtifactFilesResponse {
  status: string;
  supportProjectFiles: string;
  uploadProjectFiles: string;
}

export class UploadUserImageResponse {
  filePath: string;
  msg: string;
  status: boolean;
}

export class GetArtifactsPagingResponse {
  projects: Array<Artifact>;
  totalCount: number;
}
