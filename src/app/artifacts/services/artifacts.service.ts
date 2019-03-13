import { Injectable } from '@angular/core';
import { Artifact } from '../../shared/models/artifacts/artifact.model';

@Injectable()
export class ArtifactsService {

  constructor() { }

  private artifactsSubscription;

  /**
   * Transforms grid data artifacts recieved from the API into array of 'Artifacts' instances
   *
   * @param artifacts
   */
  static gridAdapter(artifacts: any): Array<Artifact> {
    return artifacts.map(artifact => new Artifact(artifact));
  }

  /**
   * Transforms grid data artifacts recieved from the API into array of 'Artifacts' instances
   *
   * @param artifacts
   */
  static getPopularArtifacts(artifacts: any): Array<Artifact> {
    return artifacts.map(artifact => new Artifact(artifact));
  }

}
