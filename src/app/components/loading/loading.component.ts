import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  public loading: boolean;

  public config = {
    backdropBorderRadius: '4px',
    backdropBackgroundColour: 'rgba(255, 255, 255, 0.7)',
    primaryColour: '#FC9D20',
    secondaryColour: '#FC9D20',
    tertiaryColour: '#FC9D20',
    fullScreenBackdrop: true
  };

  private unsubscribe = new Subject();

  constructor(
    private loadingSrv: LoadingService
  ) {}

  ngOnInit() {

    this.loadingSrv.status.pipe(takeUntil(this.unsubscribe)).subscribe(status => this.loading = status);

  }

}
