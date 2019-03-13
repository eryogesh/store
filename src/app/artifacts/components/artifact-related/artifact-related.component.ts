import {Artifact, UserDetails} from '../../../shared/models';
import { ArtifactSearchResponse } from '../../../shared/models/post-response.model';
import { ArtifactsSandbox } from '../../services/artifacts.sandbox';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import {GlobalErrorHandler} from '../../../error-handling/global-error-handler';
import {UtilityService} from '../../../shared/utility';

declare var yam: any;

@Component({
  selector: 'cs-artifact-related',
  templateUrl: './artifact-related.component.html',
  styleUrls: ['./artifact-related.component.css']
})
export class ArtifactRelatedComponent implements OnInit {
  copyArtifactUrlPopup: boolean;
  @Input() artifactData: Artifact;
  @Input() userDetails: UserDetails;
  @Output() relatedChange = new EventEmitter();
  public relatedArtifacts: ArtifactSearchResponse;
  public displayRelatedArtifacts = false;
  public copyArtifactUrl: string;


  constructor(private router: Router,
              public artifactsSandbox: ArtifactsSandbox,
              private globalErrorHandler: GlobalErrorHandler,
              public utilityService: UtilityService) { }

  ngOnInit() {
    const relatedArtifactData = {
      profileMapping: this.userDetails.userAccess.profileId,
      searchString: this.artifactData.projectName,
      assetId: this.artifactData.projId
    };
    this.artifactsSandbox.getRelatedArtifact(relatedArtifactData);
    this.artifactsSandbox.relatedArtifact$.subscribe((response: ArtifactSearchResponse) => {
      if (response) {
        this.relatedArtifacts = response;
        this.displayRelatedArtifacts = true;
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  relatedArtifactDetailsNavigation(project): void {
    this.router.navigate(['./artifacts/artifact-details/' + project.projId]);
    this.artifactData.projectName = project.projectName;
    this.relatedArtifacts.project_results = [];
    this.relatedChange.emit(true);
    this.ngOnInit();

  }
public yammerWindowPopup(ownername, prjName): void {
    this.copyToClipboard(false);
    yam.platform.yammerShareOpenPopup({
      customButton: true,
      defaultMessage: this.getYammerWindowPopupMessage(ownername, prjName),
      pageUrl: this.copyArtifactUrl.split('?')[0]
    });
  }

  private getYammerWindowPopupMessage(ownername, prjName): string {
    const projectName = prjName.replace(/\s/g, '%20');
    const ownerName = decodeURI(ownername).replace(/<\/?[^>]+(>|$)/g, '').replace(/%26amp%3B/g, '&');
    return projectName + ' --- ' + ownerName;
  }


   copyToClipboard(activeCopyURL: boolean): void {
    this.copyArtifactUrl = document.location.href;
    this.copyArtifactUrlPopup = activeCopyURL;
  }
}
