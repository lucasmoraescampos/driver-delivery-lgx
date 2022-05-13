import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading2',
  templateUrl: './loading2.component.html',
  styleUrls: ['./loading2.component.scss'],
})
export class Loading2Component implements OnInit {

  @Input() show: boolean;

  constructor() {}

  ngOnInit() { }

}
