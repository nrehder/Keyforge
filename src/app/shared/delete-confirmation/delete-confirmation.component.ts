import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector:'app-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrls:['./delete-confirmation.component.css']
})

export class DeleteConfirmationComponent{
    @Input() tournament:string;
    @Output() choice = new EventEmitter<string>();

    onClose(){
        this.choice.emit('close');
    }

    onDelete(){
        this.choice.emit('delete');
    }
}