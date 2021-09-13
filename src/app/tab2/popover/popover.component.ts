import { Component, OnInit } from '@angular/core';
import { ChannelsService } from 'src/app/services/channels.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})

export class PopoverComponent implements OnInit {
  channels: any;

  constructor(private service: ChannelsService) { }

  ngOnInit() {
    this.service.getChannels().subscribe((data) => {
      console.log(data);
      this.channels = data;
    });
  }
}
