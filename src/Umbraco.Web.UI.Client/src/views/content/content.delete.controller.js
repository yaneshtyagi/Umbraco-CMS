/**
 * @ngdoc controller
 * @name Umbraco.Editors.ContentDeleteController
 * @function
 * 
 * @description
 * The controller for deleting content
 */
function ContentDeleteController($scope, contentResource, treeService, navigationService, $location) {

    $scope.performDelete = function() {

        //mark it for deletion (used in the UI)
        $scope.currentNode.loading = true;

        contentResource.deleteById($scope.currentNode.id).then(function () {
            $scope.currentNode.loading = false;

            //get the root node before we remove it
            var rootNode = treeService.getTreeRoot($scope.currentNode);

            //TODO: Need to sync tree, etc...
            treeService.removeNode($scope.currentNode);

            //ensure the recycle bin has child nodes now            
            var recycleBin = treeService.getDescendantNode(rootNode, -20);

            //this could be null if the current node is a variant (i.e. it doesn't actually exist in the tree)
            if (recycleBin) {
                recycleBin.hasChildren = true;
            }

            if ($scope.currentNode.metaData && $scope.currentNode.metaData.masterDocId) {
                //this could be a variant, if it is then we should navigate to it's master
                $location.path("content/content/edit/" + $scope.currentNode.metaData.masterDocId);
            }
            

            navigationService.hideMenu();
        });

    };

    $scope.cancel = function() {
        navigationService.hideDialog();
    };
}

angular.module("umbraco").controller("Umbraco.Editors.Content.DeleteController", ContentDeleteController);