import { Routes } from '@angular/router';
import { PickListComponent } from './pick-list/pick-list.component';
import { PickDetailsComponent } from './pick-details/pick-details.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GoodsreceiptListComponent } from './goodsreceipt-list/goodsreceipt-list.component';
import { GoodsreceiptDetailsComponent } from './goodsreceipt-details/goodsreceipt-details.component';
import { MovementsListComponent } from './movements-list/movements-list.component';
import { MovementsComponent } from './movements/movements.component';
// import { TransferListComponent } from './transfer-list/transfer-list.component';
// import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { ReturnReceiptListComponent } from './return-receipt-list/return-receipt-list.component';
import { ReturnReceiptDetailsComponent } from './return-receipt-details/return-receipt-details.component';
import { ItemJournalListComponent } from './item-journal-list/item-journal-list.component';
import { ItemJournalDetailsComponent } from './item-journal-details/item-journal-details.component';
import { AuthGuardService } from '../Utility/auth-guard.service';
import { ReturnPickListComponent } from './return-pick-list/return-pick-list.component';
import { ReturnPickDetailsComponent } from './return-pick-details/return-pick-details.component';
import { TransferIntransitListComponent } from './transfer-intransit-list/transfer-intransit-list.component';
import { TransferIntransitDetailsComponent } from './transfer-intransit-details/transfer-intransit-details.component';
import { WmsSoListComponent } from './wms-so-list/wms-so-list.component';
import { WmsPoListComponent } from './wms-po-list/wms-po-list.component';
import { WmsSegmentsComponent } from './wms-segments/wms-segments.component';
import { WmsSegmentsListComponent } from './wms-segments-list/wms-segments-list.component';
import { PostedGrListComponent } from './posted-gr-list/posted-gr-list.component';
import { PostedGrDetailsComponent } from './posted-gr-details/posted-gr-details.component';
import { PostedPickListComponent } from './posted-pick-list/posted-pick-list.component';
import { PostedPickDetailsComponent } from './posted-pick-details/posted-pick-details.component';
import { PostedReturnReceiptListComponent } from './posted-return-receipt-list/posted-return-receipt-list.component';
import { PostedReturnReceiptDetailsComponent } from './posted-return-receipt-details/posted-return-receipt-details.component';
import { PostedReturnPickListComponent } from './posted-return-pick-list/posted-return-pick-list.component';
import { PostedReturnPickDetailsComponent } from './posted-return-pick-details/posted-return-pick-details.component';
import { WmsTransferReceiveListComponent } from './wms-transfer-receive-list/wms-transfer-receive-list.component';
import { WmsTransferReceiveDetailsComponent } from './wms-transfer-receive-details/wms-transfer-receive-details.component';
import { PostedTransferListComponent } from './posted-transfer-list/posted-transfer-list.component';
import { PostedTransferDetailsComponent } from './posted-transfer-details/posted-transfer-details.component';
import { PostedMovementListComponent } from './posted-movement-list/posted-movement-list.component';
import { PostedMovementDetailsComponent } from './posted-movement-details/posted-movement-details.component';
import { PickReviceComponent } from './pick-revice/pick-revice.component';
import { GrReviceComponent } from './gr-revice/gr-revice.component';

export const WarehouseRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'pick-list',
        component: PickListComponent,
        data: {
          title: 'Pick List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Pick List' }
          ]
        }
      },
      {
        path: 'pick-details',
        component: PickDetailsComponent,
        data: {
          title: 'Pick Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Pick List', url: '/warehouse/pick-list' },
            { title: 'Pick Details' }
          ]
        }
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        data: {
          title: 'Inventory',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Inventory', url: '' }
          ]
        }
      },
      {
        path: 'goodsreceipt-list',
        component: GoodsreceiptListComponent,
        data: {
          title: 'Goods Receipt',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Goods Receipt' }
          ]
        }
      },
      {
        path: 'goodsreceipt-details',
        component: GoodsreceiptDetailsComponent,
        data: {
          title: 'Goods Receipt Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Goods Receipt', url: '/warehouse/goodsreceipt-list' },
            { title: 'Goods Receipt Details' }
          ]
        }
      },
      {
        path: 'movement-list',
        component: MovementsListComponent,
        data: {
          title: 'Movement List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Movement List' }
          ]
        }
      },
      // {
      //   path: 'transfer-list',
      //   component: TransferListComponent,
      //   data: {
      //     title: 'Transfer List',
      //     urls: [
      //       { title: 'Home', url: '/dashboard/dashboard1' },
      //       { title: 'Transfer List' }
      //     ]
      //   }
      // },
      {
        path: 'movements',
        component: MovementsComponent,
        data: {
          title: 'Movements Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Movements List', url: '/warehouse/movement-list' },
            { title: 'Movements' }
          ]
        }
      },
      // {
      //   path: 'transfer-details',
      //   component: TransferDetailsComponent,
      //   data: {
      //     title: 'Transfer Details',
      //     urls: [
      //       { title: 'Home', url: '/dashboard/dashboard1' },
      //       { title: 'Transfer List', url: '/warehouse/transfer-list' },
      //       { title: 'Transfer Details' }
      //     ]
      //   }
      // },
      {
        path: 'return-receipt-list',
        component: ReturnReceiptListComponent,
        data: {
          title: 'Return Reciept List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Return Reciept List' }
          ]
        }
      },
      {
        path: 'return-receipt-details',
        component: ReturnReceiptDetailsComponent,
        data: {
          title: 'Return Reciept Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Return Reciept List', url: '/warehouse/return-receipt-list' },
            { title: 'Return Reciept Details' }
          ]
        }
      },
      {
        path: 'item-journal-list',
        component: ItemJournalListComponent,
        data: {
          title: 'Item-Journal',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Item Journal List' }
          ]
        }
      },
      {
        path: 'item-journal-details',
        component: ItemJournalDetailsComponent,
        data: {
          title: 'Item Journal Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Item Journal List', url: '/warehouse/item-journal-list' },
            { title: 'Item Journal Details' }
          ]
        }
      },
      {
        path: 'return-pick-list',
        component: ReturnPickListComponent,
        data: {
          title: 'Return Pick (PO)',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Return Pick (PO)', url: '/warehouse/return-pick-list' }
          ]
        }
      },
      {
        path: 'return-pick-details',
        component: ReturnPickDetailsComponent,
        data: {
          title: 'Return Pick Details (PO)',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Return Pick (PO)', url: '/warehouse/return-pick-list' },
            { title: 'Return Pick Details (PO)' }
          ]
        }
      },
      {
        path: 'transfer-intransit-list',
        component: TransferIntransitListComponent,
        data: {
          title: 'Transfer In-Transit',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Transfer In-Transit List', url: '/warehouse/transfer-intransit-list' }
          ]
        }
      },
      {
        path: 'transfer-intransit-details',
        component: TransferIntransitDetailsComponent,
        data: {
          title: 'Transfer In-Transit Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Transfer In-Transit List', url: '/warehouse/transfer-intransit-list' },
            { title: 'Transfer In-Transit Details' }
          ]
        }
      },
      {
        path: 'wms-so-list',
        component: WmsSoListComponent,
        data: {
          title: 'WMS SO List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WMS SO List' }
          ]
        }
      },
      {
        path: 'wms-po-list',
        component: WmsPoListComponent,
        data: {
          title: 'WMS PO List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WMS PO List' }
          ]
        }
      },
      {
        path: 'wms-segments',
        component: WmsSegmentsComponent,
        data: {
          title: 'WMS Segments',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WMS Segments' }
          ]
        }
      },
      {
        path: 'wms-segments-list',
        component: WmsSegmentsListComponent,
        data: {
          title: 'WMS Segments List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WMS Segments List' }
          ]
        }
      },
      {
        path: 'posted-gr-list',
        component: PostedGrListComponent,
        data: {
          title: 'Posted GR List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted GR List' }
          ]
        }
      },
      {
        path: 'posted-gr-details',
        component: PostedGrDetailsComponent,
        data: {
          title: 'Posted GR Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted GR List', url: '/warehouse/posted-gr-list' },
            { title: 'Posted GR Details' }
          ]
        }
      },
      {
        path: 'posted-pick-list',
        component: PostedPickListComponent,
        data: {
          title: 'Posted Pick List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Pick List' }
          ]
        }
      },
      {
        path: 'posted-pick-details',
        component: PostedPickDetailsComponent,
        data: {
          title: 'Posted Pick Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Pick List', url: '/warehouse/posted-pick-list' },
            { title: 'Posted Pick Details' }
          ]
        }
      },
      {
        path: 'posted-return-receipt-list',
        component: PostedReturnReceiptListComponent,
        data: {
          title: 'Posted Return Receipt List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Return Receipt List' }
          ]
        }
      },
      {
        path: 'posted-return-receipt-details',
        component: PostedReturnReceiptDetailsComponent,
        data: {
          title: 'Posted Return Receipt Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Return Receipt List', url: '/warehouse/posted-return-receipt-list' },
            { title: 'Posted Return Receipt Details' }
          ]
        }
      },
      {
        path: 'posted-return-pick-list',
        component: PostedReturnPickListComponent,
        data: {
          title: 'Posted Return Pick List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Return Pick List' }
          ]
        }
      },
      {
        path: 'posted-return-pick-details',
        component: PostedReturnPickDetailsComponent,
        data: {
          title: 'Posted Return Pick Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Return Pick List', url: '/warehouse/posted-return-receipt-list' },
            { title: 'Posted Return Pick Details' }
          ]
        }
      },
      {
        path: 'wms-transfer-receive-list',
        component: WmsTransferReceiveListComponent,
        data: {
          title: 'WMS Transfer Receive List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WMS Transfer Receive List' }
          ]
        }
      },
      {
        path: 'wms-transfer-receive-details',
        component: WmsTransferReceiveDetailsComponent,
        data: {
          title: 'WMS Transfer Receive Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'WMS Transfer Receive List', url: '/warehouse/wms-transfer-receive-list' },
            { title: 'WMS Transfer Receive Details' }
          ]
        }
      },
      {
        path: 'posted-transfer-list',
        component: PostedTransferListComponent,
        data: {
          title: 'Posted Transfer List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Transfer List' }
          ]
        }
      },
      {
        path: 'posted-transfer-details',
        component: PostedTransferDetailsComponent,
        data: {
          title: 'Posted Transfer Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Transfer List', url: '/warehouse/posted-transfer-list' },
            { title: 'Posted Transfer Details' }
          ]
        }
      },
      {
        path: 'posted-movement-list',
        component: PostedMovementListComponent,
        data: {
          title: 'Posted Movements List',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Movements List' }
          ]
        }
      },
      {
        path: 'posted-movement-details',
        component: PostedMovementDetailsComponent,
        data: {
          title: 'Posted Movements Details',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Posted Movements List', url: '/warehouse/posted-movement-list' },
            { title: 'Posted Movements Details' }
          ]
        }
      },
      {
        path: 'pick-revice',
        component: PickReviceComponent,
        data: {
          title: 'Pick List to Revice',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'Pick List to Revice' }
          ]
        }
      },
      {
        path: 'gr-revice',
        component: GrReviceComponent,
        data: {
          title: 'GR to Revice',
          urls: [
            { title: 'Home', url: '/dashboard/dashboard1' },
            { title: 'GR to Revice' }
          ]
        }
      }
    ]
  }
];