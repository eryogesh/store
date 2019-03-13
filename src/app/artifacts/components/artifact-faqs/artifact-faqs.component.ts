import { ArtifactFaq, PostResponse } from "../../../shared/models";
import { ArtifactsSandbox } from "../../services/artifacts.sandbox";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { GlobalErrorHandler } from "../../../error-handling/global-error-handler";

@Component({
  selector: "cs-artifact-faqs",
  templateUrl: "./artifact-faqs.component.html",
  styleUrls: ["./artifact-faqs.component.css"]
})
export class ArtifactFaqsComponent implements OnInit {
  constructor(
    private router: Router,
    public artifactsSandbox: ArtifactsSandbox,
    private messageService: MessageService,
    private activateRoute: ActivatedRoute,
    private globalErrorHandler: GlobalErrorHandler
  ) {
    this.activateRoute.params.subscribe(params => {
      this.selectedProjectId = params.artifactId;
      this.selectedArtifactOwnerId = params.artifactOwner;
    });
  }
  public faqForm: FormGroup;
  public faqAnswerForm: FormGroup;
  public userQuery: FormControl;
  public ownerAnswer: FormControl;
  public selectedProjectId: string;
  public selectedArtifactOwnerId: string;
  public queries = [];
  public display = false;
  public loading = false;
  public selectedQuestion: number;
  public selectedQuery: ArtifactFaq;
  public session = JSON.parse(sessionStorage.getItem("sessionData"));
  ngOnInit() {
    this.faqForm = new FormGroup({
      userQuery: new FormControl("", [Validators.required])
    });
    this.faqAnswerForm = new FormGroup({
      ownerAnswer: new FormControl("", [Validators.required])
    });
    this.getFaqQuery();
  }

  getFaqQuery(): void {
    this.artifactsSandbox.getQuery(this.selectedProjectId);
    this.artifactsSandbox.getQuery$.subscribe(
      (response: ArtifactFaq[]) => {
        if (response) {
          this.queries = response.reverse();
          for (let loop = 0, ilen = this.queries.length; loop < ilen; loop++) {
            if (this.queries[loop].fromUserImage) {
              this.queries[loop].fromUserImage =
                this.artifactsSandbox.downloadUrl +
                this.queries[loop].fromUserImage.replace(/\\/g, "/");
            } else {
              this.queries[loop].fromUserImage = "assets/images/user-icon.png";
            }
            if (this.queries[loop].answer.length !== 0) {
              if (this.queries[loop].toUserImage) {
                this.queries[loop].toUserImage =
                  this.artifactsSandbox.downloadUrl +
                  this.queries[loop].toUserImage.replace(/\\/g, "/");
              } else {
                this.queries[loop].toUserImage = "assets/images/user-icon.png";
              }
            }
            if (this.queries[loop].questionPostedDate) {
              this.queries[loop].questionPostedDate = this.queries[loop].questionPostedDate.substring(0, 19).replace(/\s/g, "T") + "Z";
            }
            if (this.queries[loop].answerPostedDate) {
              this.queries[loop].answerPostedDate = this.queries[loop].answerPostedDate.substring(0, 19).replace(/\s/g, "T") + "Z";
            }
          }
        }
      },
      error => this.globalErrorHandler.handleError(error)
    );
  }

  postFaqQuery() {
    const postFaqData = {
      question: this.faqForm.value.userQuery,
      assetId: this.selectedProjectId,
      toUserId: this.selectedArtifactOwnerId,
      fromUserId: this.session.userId
    };
    this.artifactsSandbox.postQuery(postFaqData);
    this.artifactsSandbox.postQuery$.subscribe(
      (response: PostResponse) => {
        if (response && response.status === true) {
          this.getFaqQuery();
        }
      },
      error => this.globalErrorHandler.handleError(error)
    );
  }

  answerFormDisplay(query) {
    this.display = true;
    this.selectedQuery = query;
  }
  postFaqAnswer(query) {
    this.loading = true;
    const faqAnswer = {
      answer: this.faqAnswerForm.value.ownerAnswer,
      questionId: query.questionId,
      assetId: this.selectedProjectId,
      toUserId: query.toUserId,
      fromUserId: this.session.userId,
      sessionAuthKey: this.session.sessionId,
      uniqueId: this.session.uniqueId
    };
    this.artifactsSandbox.postFaqAnswer(faqAnswer);
    this.artifactsSandbox.faqAnswer$.subscribe(
      (response: PostResponse) => {
        if (response && response.status === true) {
          this.display = false;
          this.loading = false;
          this.getFaqQuery();
        }
      },
      error => this.globalErrorHandler.handleError(error)
    );
  }
}
