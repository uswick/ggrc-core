/*!
  Copyright (C) 2017 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

describe('GGRC.VM.AdvancedSearchContainer', function () {
  'use strict';

  var viewModel;

  beforeEach(function () {
    viewModel = new GGRC.VM.AdvancedSearchContainer();
  });

  describe('removeItem() method', function () {
    it('removes attribute and operator behind if item is first',
    function () {
      var viewItems;
      viewModel.attr('items', [
        GGRC.Utils.AdvancedSearch.create.attribute({field: 'first'}),
        GGRC.Utils.AdvancedSearch.create.operator(),
        GGRC.Utils.AdvancedSearch.create.attribute({field: 'second'})
      ]);
      viewItems = viewModel.attr('items');

      viewModel.removeItem(viewItems[0]);

      expect(viewItems.length).toBe(1);
      expect(viewItems[0].type).toBe('attribute');
      expect(viewItems[0].value.field).toBe('second');
    });

    it('removes attribute and operator in front if item is not first',
    function () {
      var viewItems;
      viewModel.attr('items', [
        GGRC.Utils.AdvancedSearch.create.attribute({field: 'first'}),
        GGRC.Utils.AdvancedSearch.create.operator(),
        GGRC.Utils.AdvancedSearch.create.attribute({field: 'second'})
      ]);
      viewItems = viewModel.attr('items');

      viewModel.removeItem(viewItems[2]);

      expect(viewItems.length).toBe(1);
      expect(viewItems[0].type).toBe('attribute');
      expect(viewItems[0].value.field).toBe('first');
    });

    it('calls remove() if it is group and single attribute was removed',
    function () {
      var viewItems;
      viewModel.attr('items', [
        GGRC.Utils.AdvancedSearch.create.attribute({field: 'single'})
      ]);
      viewItems = viewModel.attr('items');
      spyOn(viewModel, 'remove');

      viewModel.removeItem(viewItems[0], true);

      expect(viewModel.remove).toHaveBeenCalled();
    });

    it('does not calls remove() if it is not group' +
      ' and single attribute was removed',
    function () {
      var viewItems;
      viewModel.attr('items', [
        GGRC.Utils.AdvancedSearch.create.attribute({field: 'single'})
      ]);
      viewItems = viewModel.attr('items');
      spyOn(viewModel, 'remove');

      viewModel.removeItem(viewItems[0]);

      expect(viewModel.remove).not.toHaveBeenCalled();
    });
  });
});
