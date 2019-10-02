import { Component, Input, ViewChild, ContentChild, TemplateRef, Output, EventEmitter, OnInit } from '@angular/core';
import { MatCheckboxChange, MatSelectionList, MatSelectionListChange } from '@angular/material';
import { TransferItemIntialMsgDirective } from './transfer-item-intial-msg/transfer-item-intial-msg.component';
import { FADE_OPACTIY_ANIMATION } from '../animations/fade-opactiy.animation';
import { BehaviorSubject } from 'rxjs';



@Component({
    selector: 'transfer-items',
    templateUrl: './transfer-items.component.html',
    styleUrls: ['transfer-items.component.scss'],
    animations: [FADE_OPACTIY_ANIMATION]
})
export class TransferItemComponent {

    @Input() selectAllToolTipMsg = 'select all items';
    @Input() set data(data) {
        if (data) {
            this._data = data;
            this.selectAllChecked = false;
            this.selectedData = [];
            this.selectionUpdate.emit(this.selectedData);
            this._data.forEach(d => d.isSelected = false);
        }

    };
    @Input() leftWidth = 50;
    @Input() displayPropName;
    @Input() noDataSelectedMsg;
    @Output() selectionUpdate = new EventEmitter<any[]>();
    @Input() loaderStatus$: BehaviorSubject<boolean>;
    @ViewChild(MatSelectionList, { static: false }) selectList: MatSelectionList;
    @ContentChild(TransferItemIntialMsgDirective, { static: false, read: TemplateRef })
    intialMsg: TemplateRef<TransferItemIntialMsgDirective>;

    loading;
    selectAllChecked;
    searchTerm = '';
    selectedData: any[] = [];
    _data: any[];

    selectAllChange($event: MatCheckboxChange) {
        if (this._data && this._data.length) {
            if ($event.checked) {
                this.selectList.selectAll();
                this._data.forEach(d => d.isSelected = true);
                return this.selectedData = [...this._data];
            }
            this.selectList.deselectAll();
            this.selectedData = [];
            this._data.forEach(d => d.isSelected = false);
        }
        this.selectionUpdate.emit(this.selectedData);
    }

    removeItem(removeData) {
        const rightListIndex = this.selectedData.indexOf(removeData);
        if (rightListIndex !== - 1) {
            this.selectedData.splice(rightListIndex, 1);
        }

        this._data.find((data, i) => data === removeData).isSelected = false;

        this.selectAllChecked = this._data.every(d => d.isSelected);
        this.selectionUpdate.emit(this.selectedData);
    }

    onSelect($event: MatSelectionListChange) {
        const value = $event.option.value;
        const obj = $event.option.value;
        if ($event.option.selected) {
            this.selectedData.push(value)
            this.selectedData.sort((a, b) => +a[this.displayPropName] - +b[this.displayPropName]);
            obj.isSelected = true;
        } else {
            if (this.selectedData.indexOf(value) !== -1) {
                const i = this.selectedData.indexOf(value);
                this.selectedData.splice(i, 1).sort((a, b) => +a[this.displayPropName] - +b[this.displayPropName]);
                obj.isSelected = false;
            }
        }
        this.selectAllChecked = this.selectedData.every(d => d.isSelected);
        this.selectionUpdate.emit(this.selectedData);
    }
}