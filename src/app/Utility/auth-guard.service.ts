import { Component, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouteInfo } from '../shared/sidebar/sidebar.metadata';
import { LoginComponent } from '../authentication/login/login.component';
import { NavigationComponent } from '../shared/header-navigation/navigation.component';
import UtilsForGlobalData from './UtilsForGlobalData';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

    public sidebarnavItems: any[];
    globalData: Object;
    ROUTES: RouteInfo[] = [];

    constructor(private router: Router,
        private toaster: ToastrService,
        private appComponent: LoginComponent,
        private navigationComp: NavigationComponent
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        window.addEventListener('beforeunload', (event) => {
            event.returnValue = `Are you sure you want to leave?`;
        });

        if (UtilsForGlobalData.retrieveLocalStorageKey("accessToken") == null) {
            this.router.navigate(['/']);
        }
        if (route.root.component == null) {
            var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
            timer.isRefresh = true;
            UtilsForGlobalData.setLocalStorageKey("timerJson", JSON.stringify(timer));
            this.navigationComp.continueSessionOnClick();
        } else {
            var timer = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('timerJson'));
            timer.isRefresh = false;
            UtilsForGlobalData.setLocalStorageKey("timerJson", JSON.stringify(timer));
        }
        var user = JSON.parse(UtilsForGlobalData.retrieveLocalStorageKey('getJsonRouter'));
        // console.log(state.url);
        if (route.data.urls.length > 2) {
            search2(user, route.data.urls[route.data.urls.length - 2].url);
        } else {
            search2(user, state.url);
        }
        var idSearch;
        function search2(data, id): string {
            var yourData = $.map(data, function (el) { return el });
            var res = $.grep(yourData, function (e) {
                if (e.path.indexOf(id) != -1) {
                    idSearch = (e.id);
                    return e.id;
                }
                if (e.submenu) {
                    search2(e.submenu, id);
                }
            });
            if (res.length > 0) {
                return res[0].mid;
            }
        }
        if (idSearch != undefined) {
            return true;
        }

        if (state.url.includes("code=") || state.url == '/dashboard/dashboard1') {
            return true;
        }


        this.toaster.warning("User Unauthorized", "ACCESS DENIED");
        return false;
    }

}