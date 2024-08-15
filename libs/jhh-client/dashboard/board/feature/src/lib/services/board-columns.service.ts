import { ElementRef, inject, Injectable } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragMove,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

import {
  BoardColumn,
  BoardColumnItem,
  LocalStorageKey,
} from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class BoardColumnsService {
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  dropColumn(
    columns: BoardColumn[],
    event: CdkDragDrop<BoardColumn[]>
  ): BoardColumn[] {
    if (event.previousContainer === event.container) {
      const columnsClone: BoardColumn[] = JSON.parse(JSON.stringify(columns));

      moveItemInArray(columnsClone, event.previousIndex, event.currentIndex);

      return columnsClone.map((column, index) => ({
        ...column,
        order: index,
      }));
    }

    return columns;
  }

  dropItem(
    columns: BoardColumn[],
    event: CdkDragDrop<BoardColumnItem[]>
  ): BoardColumn[] {
    const columnsClone: BoardColumn[] = JSON.parse(JSON.stringify(columns));
    const previousColumnIndex: number = columnsClone.findIndex(
      (column) =>
        column.id === event.previousContainer.id.replace('drop-list-', '')
    );
    const currentColumnIndex: number = columnsClone.findIndex(
      (column) => column.id === event.container.id.replace('drop-list-', '')
    );

    if (event.previousContainer === event.container) {
      moveItemInArray(
        columnsClone[currentColumnIndex].items,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        columnsClone[previousColumnIndex].items,
        columnsClone[currentColumnIndex].items,
        event.previousIndex,
        event.currentIndex
      );
    }

    columnsClone.forEach((column) => {
      column.items.forEach((item, index) => {
        item.order = index;
      });
    });

    return columnsClone;
  }

  addItem(
    columns: BoardColumn[],
    columnId: string,
    editableContent: { [key: string]: string },
    editingItem: {
      [key: string]: boolean;
    }
  ): BoardColumn[] {
    const newItem: BoardColumnItem = {
      id: `temp-${Date.now()}`,
      createdAt: null as any,
      updatedAt: null as any,
      content: 'New item',
      order: columns.find((c) => c.id === columnId)!.items.length,
      columnId: columnId,
    };
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          items: [...column.items, newItem],
        };
      }
      return column;
    });

    editingItem[newItem.id] = true;
    editableContent[newItem.id] = newItem.content;

    return updatedColumns;
  }

  handleBlur(
    columns: BoardColumn[],
    item: BoardColumnItem,
    editableContent: { [key: string]: string }
  ): {
    updatedColumns: BoardColumn[];
    contentChanged: boolean;
  } {
    const updatedContent: string = editableContent[item.id];
    let contentChanged: boolean = false;

    if (item.content !== updatedContent) {
      const updatedColumns: BoardColumn[] = columns.map((column) => {
        if (column.id === item.columnId) {
          const updatedItems = column.items.map((i) =>
            i.id === item.id ? { ...i, content: updatedContent } : i
          );

          return { ...column, items: updatedItems };
        }

        return column;
      });

      contentChanged = true;
      return { updatedColumns, contentChanged };
    }

    return { updatedColumns: columns, contentChanged };
  }

  removeItem(
    columns: BoardColumn[],
    columnId: string,
    itemId: string,
    removedItemIds: string[]
  ): BoardColumn[] {
    const updatedColumns: BoardColumn[] = columns.map((column) => {
      if (column.id === columnId) {
        const itemToRemove = column.items.find((item) => item.id === itemId);

        if (itemToRemove && !itemToRemove.id.startsWith('temp-')) {
          removedItemIds.push(itemToRemove.id);
        }

        return {
          ...column,
          items: column.items.filter((item) => item.id !== itemId),
        };
      }

      return column;
    });

    return updatedColumns;
  }

  handleAppClose = (
    updatedColumns: BoardColumn[],
    removedItemIds: string[]
  ): string | void => {
    if (updatedColumns.length || removedItemIds.length) {
      const unsavedBoardRequestId: string = String(Date.now());
      localStorage.setItem(
        LocalStorageKey.UnsavedBoardRequestId,
        unsavedBoardRequestId
      );
      this.boardFacade.updateBoardColumns(
        updatedColumns,
        removedItemIds,
        unsavedBoardRequestId
      );
    }
  };

  getOnlyUpdatedColumns(
    originalColumns: BoardColumn[],
    currentColumns: BoardColumn[]
  ): BoardColumn[] {
    const updatedColumns: BoardColumn[] = [];
    const originalItemDetails: Map<
      string,
      { originalOrder: number; originalColumnId: string }
    > = new Map<string, { originalOrder: number; originalColumnId: string }>();

    originalColumns.forEach((column) => {
      column.items.forEach((item, index) => {
        originalItemDetails.set(item.id, {
          originalOrder: index,
          originalColumnId: column.id,
        });
      });
    });

    currentColumns.forEach((column) => {
      const originalColumn: BoardColumn | undefined = originalColumns.find(
        (oc) => oc.id === column.id
      );
      let columnUpdated: boolean = false;

      const updatedColumn: Partial<BoardColumn> = {
        id: column.id,
        items: [],
      };

      if (originalColumn) {
        if (column.name !== originalColumn.name) {
          updatedColumn.name = column.name;
          columnUpdated = true;
        }

        if (column.color !== originalColumn.color) {
          updatedColumn.color = column.color;
          columnUpdated = true;
        }

        if (column.order !== originalColumn.order) {
          updatedColumn.order = column.order;
          columnUpdated = true;
        }
      }

      column.items.forEach((item, index) => {
        const originalItem: BoardColumnItem | undefined =
          originalColumn?.items.find((oi) => oi.id === item.id);
        const originalDetails:
          | {
              originalOrder: number;
              originalColumnId: string;
            }
          | undefined = originalItemDetails.get(item.id);

        if (
          !originalItem ||
          (originalItem && item.content !== originalItem.content) ||
          (originalDetails &&
            (originalDetails.originalOrder !== index ||
              originalDetails.originalColumnId !== column.id))
        ) {
          updatedColumn.items!.push(item);
          columnUpdated = true;
        }
      });

      if (
        originalColumn &&
        originalColumn.items.length !== column.items.length
      ) {
        columnUpdated = true;
      }

      if (columnUpdated) {
        updatedColumns.push(updatedColumn as BoardColumn);
      }
    });

    return updatedColumns;
  }

  mergeWithWorkingData(
    currentColumns: BoardColumn[],
    newData: BoardColumn[],
    wasUpdateTriggeredInternally: boolean
  ): BoardColumn[] {
    if (wasUpdateTriggeredInternally) {
      return newData;
    } else {
      const newDataMap: Map<string, BoardColumn> = new Map(
        newData.map((column) => [column.id, column])
      );
      let mergedColumns: BoardColumn[] = currentColumns.filter((column) =>
        newDataMap.has(column.id)
      );

      mergedColumns = mergedColumns.map((column) => {
        const newColumnData = newDataMap.get(column.id)!;
        return {
          id: column.id,
          createdAt: column.createdAt,
          updatedAt: newColumnData.updatedAt,
          name: newColumnData.name,
          color: newColumnData.color,
          order: column.order,
          items: column.items,
        };
      });

      newData.forEach((column) => {
        if (!mergedColumns.some((c) => c.id === column.id)) {
          mergedColumns.push(column);
        }
      });

      return mergedColumns;
    }
  }

  scrollColumnToBottom(columnId: string, container: ElementRef): void {
    const columnElement = container.nativeElement.querySelector(
      `#drop-list-${columnId}`
    );
    if (columnElement) {
      columnElement.scrollTop = columnElement.scrollHeight;
    }
  }

  scrollHorizontal(event: CdkDragMove, container: ElementRef): void {
    const point: { x: number; y: number } = event.pointerPosition;
    const bounds = container.nativeElement.getBoundingClientRect();
    const edgeThreshold: number = 50;
    const leftDistance: number = point.x - bounds.left;
    const rightDistance: number = bounds.right - point.x;

    if (leftDistance < edgeThreshold) {
      container.nativeElement.scrollLeft -= Math.max(
        1,
        (leftDistance / edgeThreshold) * 20
      );
    } else if (rightDistance < edgeThreshold) {
      container.nativeElement.scrollLeft += Math.max(
        1,
        (rightDistance / edgeThreshold) * 20
      );
    }
  }

  scrollVertical(event: CdkDragMove, columnEl: HTMLDivElement): void {
    const point: { x: number; y: number } = event.pointerPosition;
    const bounds: DOMRect = columnEl.getBoundingClientRect();
    const edgeThreshold: number = 50;
    const topDistance: number = point.y - bounds.top;
    const bottomDistance: number = bounds.bottom - point.y;

    if (topDistance < edgeThreshold) {
      columnEl.scrollTop -= Math.max(1, (topDistance / edgeThreshold) * 20);
    } else if (bottomDistance < edgeThreshold) {
      columnEl.scrollTop += Math.max(1, (bottomDistance / edgeThreshold) * 20);
    }
  }
}
