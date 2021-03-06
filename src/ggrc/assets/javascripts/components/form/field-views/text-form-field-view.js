/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('textFormFieldView', {
    tag: 'text-form-field-view',
    template: can.view(
      GGRC.mustache_path + '/components/form/' +
        'field-views/text-form-field-view.mustache'
    ),
    viewModel: {
      value: null,
      disabled: false
    }
  });
})(window.can, window.GGRC);
