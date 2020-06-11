/*
 Register all controllers that need to be loaded
 controller itself should be handling registration to angular app module
 */

var path = 'scripts/controllers/';
define(['MainController', 'CasesController', 'MyCasesController', 'LoginController', 'AdminConsoleController', 'TaskPanelController',
    'CaseDialogController', 'DashboardController', 'ProfileController', 'TasksController', 'WorkflowController', 'WorkflowPanelController']
    .map(ctrl => path + ctrl), function () {
});
