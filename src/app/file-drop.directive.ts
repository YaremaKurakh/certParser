import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<any>();

  constructor() {}

  @HostBinding('style.background-color') private background = '';

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#9EC9FF';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '';
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    const files = event.dataTransfer!.files[0];
    event.preventDefault();
    event.stopPropagation();
    this.background = '';

    this.fileDropped.emit(files);
  }
}
