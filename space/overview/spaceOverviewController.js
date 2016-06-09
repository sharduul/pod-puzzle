(function(){
	'use strict';

	angular
		.module('cust-controllers', [])
		.controller('customerController', CustomerController);

    CustomerController.$inject = ['customerResource', '$uibModal', '$state', 'customerService'];

	function CustomerController(customerResource, $uibModal, $state, customerService){
		var vm = this;

        vm.searchFilter = { firstName: "", lastName: ""};
        vm.customerGridOptions = {};
        vm.search = search;
        vm.edit = edit;
        vm.deleteCustomer = deleteCustomer;

		(function(){

            // define the grid options
            gridOptions();

            // get customer data
            // NOTE: in real world application it will always call API to get the list of customers
            var customerList = customerService.getCustomerList();
            if(customerList && customerList.length > 0){
                vm.customerGridOptions.data = customerList;
            }
            else{
                customerResource.customer().get(function(data){
                    vm.customerGridOptions.data = data;
                    customerService.saveCustomerList(data);
                });
            }


		})();


        // grid definition
        function gridOptions(){
            vm.customerGridOptions = {
                //data: customerList,
                multiSelect: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                paginationPageSizes: [2, 10, 50],
                paginationPageSize: 10,
                columnDefs: [
                    {name: 'Action',
                        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.customer.edit(row)" title="TOOLTIP"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>' +
                                      '<a class="ui-grid-cell-contents" title="TOOLTIP" ng-click="grid.appScope.customer.deleteCustomer(row)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>'},
                    {name: 'First name', field: 'firstName'},
                    {name: 'Middle name', field: 'middleName'},
                    {name: 'Last name', field: 'lastName'},
                    {name: 'Nickname', field: 'nickName'},
                    {name: 'Marital status', field: 'maritalStatus'}
                ]
            };
        }

        // go to the edit screen for the customer
        function edit(row){
            $state.go('editCustomer', { customerId: row.entity.id });
        }


        // show delete confirmation dialog and delete if confirmed
        // NOTE: in real world application it will call delete API with just the customer Id
        function deleteCustomer(row){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'customerDeleteModal.html',
                controller: customerDeleteModalCtrl,
                size: 'sm'
            });

            // if user confirms delete.. then delete the customer
            modalInstance.result.then(function (deleteCustomer) {
                if(deleteCustomer){
                    _.remove(vm.customerGridOptions.data,  { 'id': row.entity.id });
                }
            });
        }

        function customerDeleteModalCtrl($scope, $uibModalInstance){
            // this scope is different than the customer controller scope
            $scope.delete = function () {
                $uibModalInstance.close(true);
            };

            // cancel the delete operation
            $scope.cancel = function () {
                $uibModalInstance.close(false);
            };
        }


        // NOTE: in real world application it will the a server side search
        // where filter params will be the firstname and lastname
        function search(){
            var searchQuery = {
                firstName: vm.searchFilter.firstName,
                lastName: vm.searchFilter.lastName
            };

            vm.customerGridOptions.data = customerService.searchCustomer(searchQuery);
            vm.searchFilter = { firstName: "", lastName: ""};
        }

	}

})();