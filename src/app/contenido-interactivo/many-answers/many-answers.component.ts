import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { ActivityService } from '../../services/activity.service';
import { QuestionService } from '../../services/question.service';
import { MarkService } from '../../services/mark.service';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-many-answers',
  templateUrl: './many-answers.component.html',
  styleUrls: ['./many-answers.component.css'],

  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class ManyAnswersComponent implements OnInit {

  modalRef: BsModalRef;
  question: string;
  statusAnswer = false;
  answer: string;
  existingContent: any;
  existingMarkers: any;
  makersLoaded: boolean;
  contentSelectedOption: string;

  listAnswers: Array<{ name: string, status: boolean }> = new Array();
  questionDto: Array<{ question: string, answers: any }> = new Array();

  public tools: object = {
            items: [
                'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
                'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
                'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
        };

  constructor(private modalService: BsModalService,
              private contentService: ContentService, private markService: MarkService,
              private activityService: ActivityService, private questionService: QuestionService ) { }

  ngOnInit() {
    this.contentService.getAllContent().subscribe( data => {
      this.existingContent = data;
    });
  }
  onKeyAnswer(value) {
  this.answer = value;
  }

  checkStatusAnswer(value) {
    this.statusAnswer = value;
  }

  addAnswer() {
    this.listAnswers.push({name: this.answer, status: this.statusAnswer });
    this.answer = '';
    this.statusAnswer = false;
  }

  addQuestion() {
    this.questionDto.push({question: this.question, answers: this.listAnswers});
  }

  restartData() {
    this.question = '';
    this.statusAnswer = false;
    this.answer = '';
    this.listAnswers = new Array();
    this.questionDto = new Array();
    this.makersLoaded = false;
    this.existingMarkers = [];
    this.contentSelectedOption = '';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  selectContentId(filterVal: any) {
    this.makersLoaded = false;
    console.log(filterVal);
    this.markService.getMarkersFromContent(+filterVal).subscribe( data => {
      this.existingMarkers = [];
      this.existingMarkers = data;
      this.makersLoaded = true;
    });
  }

  /*
  selectMarkerId(markerId: any) {
    this.makersLoaded = false;
    console.log(markerId);
    this.selectMarkerId = markerId;
    this.makersLoaded = true;
    //this.markService.getMarkersFromContent(parseInt(filterVal)).subscribe( data => {
    //  this.existingContent = data;
    //  this.makersLoaded = true;
    //});
  }
  */

  onClickSubmit(formData) {
    this.questionDto.forEach( obj => {
      const questText = obj.question.replace('<p>', '').replace('</p>', '');
      this.activityService.createActivity(formData.activityName, formData.trysNumber,
        JSON.parse(formData.retro), +formData.marker).subscribe( data => {
        this.questionService.createQuestion(questText, data.id).subscribe( res => {
          obj.answers.forEach( obj2 => {
            this.questionService.createMultipleOptionAnswer(obj2.name, obj2.status, res.id).subscribe( data => {
              console.log('Exito');
            });
          });
          this.restartData();
        });
      });
    });
  }
}
