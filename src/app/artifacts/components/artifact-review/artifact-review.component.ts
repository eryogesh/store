import {Artifact, ArtifactReview, UserDetails} from '../../../shared/models';
import { PostResponse } from '../../../shared/models/post-response.model';
import { ArtifactsSandbox } from '../../services/artifacts.sandbox';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { UtilityService } from '../../../shared/utility';
import { AppSandbox } from '../../../app.sandbox';

@Component({
  selector: 'cs-artifact-review',
  templateUrl: './artifact-review.component.html',
  styleUrls: ['./artifact-review.component.css']
})
export class ArtifactReviewComponent implements OnInit {
  constructor(public artifactsSandbox: ArtifactsSandbox,
              private messageService: MessageService,
              public utilityService: UtilityService,
              private globalErrorHandler: GlobalErrorHandler,
              public appsandbox: AppSandbox) {
  }
  @Input() artifactData: Artifact;
  @Input() hideNewVersionTemplate: boolean;
  @Input() userDetails: UserDetails;
  @Output() ratingChange = new EventEmitter();
  public userReviewComment = new ArtifactReview();
  public artifactReviewList: ArtifactReview[];
  public displayReviewList = false;
  public displayReview = false;
  public reviewListCount: number;
  public session = JSON.parse(sessionStorage.getItem('sessionData'));
  private reviewUpdatedMsg: string;
  private success: string;

  ngOnInit() {
    this.artifactsSandbox.artifactReview(this.artifactData.projId);
    this.artifactsSandbox.artifactReviewsList$.subscribe((reviewList: ArtifactReview[]) => {
      if (reviewList) {
        if (reviewList.length > 0) {
          for (let counter = 0, ilen = reviewList.length; counter < ilen; counter++) {
            if (reviewList[counter].userId === this.session.userId) {
              this.userReviewComment.reviewText = reviewList[counter].reviewText;
              this.userReviewComment.reviewId = reviewList[counter].reviewId;
              this.userReviewComment.rating = reviewList[counter].rating;
              this.userReviewComment.projectID = reviewList[counter].projectID;
              break;
            }
          }
        }
        this.artifactReviewList = reviewList;
        for (let i = 0, ilen = this.artifactReviewList.length; i < ilen; i++) {
          if (this.artifactReviewList[i].userImage) {
            const imgUrl = this.artifactsSandbox.downloadUrl + this.artifactReviewList[i].userImage;
            this.artifactReviewList[i].userImage = imgUrl.replace(/\\/g, '/');
          } else {
            this.artifactReviewList[i].userImage = 'assets/images/user-icon.png';
          }
        }
        this.reviewListCount = reviewList.length;
        this.displayReviewList = true;
      }
    }, error => this.globalErrorHandler.handleError(error));
    this.reviewLangChange();
    this.appsandbox.translate.onLangChange.subscribe(() => {
      this.reviewLangChange();
    });
  }

  reviewLangChange() {
    this.appsandbox.translate.get('artifact-details.Message.Success').subscribe((res: string) => {
      this.success = res;
    });
    this.appsandbox.translate.get('artifact-details.Message.ReviewUpdatedMsg').subscribe((res: string) => {
      this.reviewUpdatedMsg = res;
    });
  }
  postProjectReviews(review) {
    if (!review.reviewId) {
      review.reviewId = 0;
    }
    const reviewData = {
      rating: review.rating,
      reviewText: review.reviewText,
      reviewId: review.reviewId,
      projectId: this.artifactData.projId,
    };
    this.artifactsSandbox.postProjectReview(reviewData);
    this.artifactsSandbox.artifactReviewPost$.subscribe((response: PostResponse) => {
      this.messageService.add({ severity: 'success', summary: this.success, detail: this.reviewUpdatedMsg });
      this.ratingChange.emit(true);
      this.ngOnInit();
      this.displayReview = false;
    }, error => this.globalErrorHandler.handleError(error));
  }

}
