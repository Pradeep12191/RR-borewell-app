import { Component, Input, OnInit, ContentChild, TemplateRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Column } from './Column';
import { MediaObserver } from '@angular/flex-layout';
import { ExpandDetailsDirective } from './expand-deatils.directive';
import { ROTATE_ARROW_ANIMATION, EXPAND } from '../animations';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'expand-table',
    templateUrl: './expand-table.component.html',
    styleUrls: ['./expand-table.component.scss'],
    animations: [EXPAND, ROTATE_ARROW_ANIMATION]
})
export class ExpandTableComponent implements OnInit, OnDestroy {
    @Input() columns: Column[];
    @Input() data: any[];
    @Input() set expandAll(flag) {
        this._expandAll = flag;
        this.expandAllRow(flag);
    };
    @Input() set dataSource(dataSource: MatTableDataSource<any>){
        this._dataSource = dataSource
        this.expandAllRow(this._expandAll);
    };
    @Input() expandFirstRow;
    @Output() iconButtonClick = new EventEmitter();
    @Input() accordionEffect = true;
    @Input() dataChanges: Subject<any>;
    @Input() isHeaderSticky = false;
    @ContentChild(ExpandDetailsDirective, { read: TemplateRef, static: false }) detailsTpl: TemplateRef<ExpandDetailsDirective>;
    displayedColumns = [];
    expandedRow;
    _expandAll;
    _dataSource;
    dataChangesSubcription: Subscription

    constructor(
        private mediaObs: MediaObserver
    ) {

    }

    ngOnInit() {
        this.displayedColumns = this.columns.map(col => col.id);
        if (this.mediaObs.isActive('lt-md')) {
            this.displayedColumns = this.columns.filter(col => !col.isDesktopOnly).map(col => col.id);
        }
        if (this.expandFirstRow) {
            if (this.data && this.data.length) {
                this.data[0]['expand'] = true;
            }
        }

        if (this.dataChanges) {
            this.dataChanges.subscribe(() => {
                setTimeout(() => {
                    
                })
                
            })
        }

    }

    ngOnDestroy() {
        if (this.dataChangesSubcription) { this.dataChangesSubcription.unsubscribe() }
    }

    expandRow(currentRow, expand) {
        if (this.accordionEffect) {
            this.data.forEach(r => r['expand'] = false);
        }
        currentRow.expand = !expand;
        this._expandAll = !this.data.every(r => !r['expand']);
    }

    expandAllRow(isExpand) {
        if (this.data && this.data.length) {
            this.data.forEach(r => r['expand'] = isExpand);
        }
    }

    onHeaderClick(colHeaderId) {
        if (colHeaderId === 'more_details') {
            this._expandAll = !this._expandAll
            this.expandAllRow(this._expandAll);
        }

    }

    buttonIconClick(action, rowData) {
        this.iconButtonClick.emit({ action, rowData })
    }
}