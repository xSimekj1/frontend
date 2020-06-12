/*  Top level module
    map all application components
 */
define('app', ['angular', 'config', 'angularMaterial', 'angularHal', 'angularCurrencyFormat', 'angularRouteSegment', 'angularMaterialExpansionPanels', 'angularInView',
        'scripts/directives/DirectivesLoader',
        'scripts/filters/FiltersLoader',
        'scripts/services/ServicesLoader',
        'scripts/components/ComponentsLoader',
        'scripts/controllers/ControllersLoader'],
    function (angular, config) {
        // console.log(angular.version);
        let app = angular.module('app', ['ngMaterial', 'ngMessages', 'angular-hal', 'currencyFormat', 'ngRoute', 'route-segment', 'material.components.expansionPanels', 'view-segment', 'angular-inview',
            'ngMain', 'ngCases', 'ngAdmin', 'ngTasks', 'ngWorkflow']); // Here add modules that you defined
        app.config(function ($mdThemingProvider, $routeProvider, $routeSegmentProvider, $locationProvider, $httpProvider, $mdDateLocaleProvider) {
            const theme = config.themes[config.theme];
            if (theme.primary instanceof Object)
                $mdThemingProvider.definePalette('mainPalette', theme.primary);
            if (theme.accent instanceof Object)
                $mdThemingProvider.definePalette('accentPalette', theme.accent);
            if (theme.warn instanceof Object)
                $mdThemingProvider.definePalette('warnPalette', theme.warn);

            const theming = $mdThemingProvider.theme('default');
            if (typeof theme.primary === "string")
                theming.primaryPalette(theme.primary);
            else
                theming.primaryPalette('mainPalette');

            if (typeof theme.accent === "string")
                theming.accentPalette(theme.accent);
            else
                theming.accentPalette('accentPalette');

            if (typeof theme.warn === "string")
                theming.warnPalette(theme.warn);
            else
                theming.warnPalette('warnPalette');

            if (typeof theme.background === 'string')
                theming.backgroundPalette(theme.background);
            else
                theming.backgroundPalette('configBackgroundPalette');

            $routeSegmentProvider.options.autoLoadTemplates = true;
            $routeSegmentProvider.options.strictMode = true;
            $routeSegmentProvider
                .when('/', 'app')
                .when('/login', 'login')
                .when('/signup/:token', 'signup')
                .when('/recover/:token', 'recover')
                .when('/dashboard', 'app.dashboard')
                .when('/cases', 'app.cases')
                .when('/listings', 'app.listings')
                .when('/filter', 'app.filter')
                .when('/transactions', 'app.transactions')
                .when('/payments', 'app.payments')
                .when('/mycases', 'app.mycases')
                .when('/console', 'app.console')
                .when('/profile', 'app.profile')
                .when('/tasks', 'app.tasks')
                .when('/workflow', 'app.workflow')
                .when('/settings', 'app.settings')

                .segment('app', {
                    templateUrl: "views/app/main.html",
                    controller: 'MainController',
                    controllerAs: 'mainCtrl'
                })
                .within()
                .segment('cases', {
                    default: true,
                    templateUrl: "views/app/cases.html",
                    controller: 'CasesController',
                    controllerAs: 'caseCtrl'
                })
                .segment('listings', {
                    default: true,
                    templateUrl: "views/app/listingsView.html",
                    controller: 'ListingsController',
                    controllerAs: 'listingsCtrl'
                })
                .segment('filter', {
                    default: true,
                    templateUrl: "views/app/filterView.html",
                    controller: 'FilterController',
                    controllerAs: 'filterCtrl'
                })
                .segment('transactions', {
                    default: true,
                    templateUrl: "views/app/transactionsView.html",
                    controller: 'TransactionsController',
                    controllerAs: 'transactionsCtrl'
                })
                .segment('payments', {
                    default: true,
                    templateUrl: "views/app/paymentsView.html",
                    controller: 'PaymentsController',
                    controllerAs: 'paymentsCtrl'
                })
                .segment('mycases', {
                    templateUrl: "views/app/mycases.html",
                    controller: 'MyCasesController',
                    controllerAs: 'mycaseCtrl'
                })
                .segment('console', {
                    templateUrl: "views/app/console.html",
                    controller: 'AdminConsoleController',
                    controllerAs: 'adminCtrl'
                })
                .segment('profile', {
                    templateUrl: 'views/app/profile.html',
                    controller: 'ProfileController',
                    controllerAs: 'profCtrl'
                })
                .segment('tasks', {
                    templateUrl: 'views/app/tasks.html',
                    controller: 'TasksController',
                    controllerAs: 'tasksCtrl'
                })
                .segment('workflow', {
                    templateUrl: 'views/app/workflow.html',
                    controller: 'WorkflowController',
                    controllerAs: 'workCtrl'
                })
                .segment('settings', {
                    templateUrl: 'views/app/settings.html',
                    controller: 'SettingsController',
                    controllerAs: 'settCtrl'
                })
                .up()
                .segment('login', {
                    templateUrl: "views/login/login.html",
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl'
                })
                .segment('signup', {
                    templateUrl: "views/login/signup.html",
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl',
                    dependencies: ['token']
                })
                .segment('recover', {
                    templateUrl: "views/login/recover.html",
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl',
                    dependencies: ['token']
                });
            $routeProvider.otherwise({redirectTo: '/'});

            $locationProvider.html5Mode(true);
            $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
            $httpProvider.defaults.headers.common['Accept-Language'] = localStorage.getItem("locale") || config.defaults.locale;
            $httpProvider.interceptors.push('$authToken');
            $httpProvider.interceptors.push('authHttpInterceptor');

            $mdDateLocaleProvider.firstDayOfWeek = 1;
            $mdDateLocaleProvider.formatDate = date => {
                if (date) return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
                else return null;
            };
            $mdDateLocaleProvider.parseDate = date => {
                if (date instanceof String || typeof date === 'string') {
                    const parts = date.split(/\./);
                    if (parts.length === 3) {
                        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                }
                return new Date(NaN);
            };
        });
        app.run(function ($log, $auth, $rootScope, $i18n, $user, $config, $snackbar, $process, $authToken) {
            $log.debug("App is running...");
            $authToken.init();
            $auth.init();
            $rootScope.$i18n = $i18n;
            $rootScope.$user = $user;
            $rootScope.$config = $config;
            $rootScope.$snackbar = $snackbar;
            $rootScope.$process = $process;
        });

        return app;
    });