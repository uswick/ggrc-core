# coding: utf-8

# Copyright (C) 2016 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

"""Tests for /query api endpoint."""


from sqlalchemy import func
from flask import json

from ggrc import views
from ggrc import models
from ggrc import db

from integration.ggrc.converters import TestCase
from integration.ggrc.models import factories


class BaseQueryAPITestCase(TestCase):
  """Base class for /query api tests with utility methods."""

  def setUp(self):
    """Log in before performing queries."""
    super(BaseQueryAPITestCase, self).setUp()
    self.client.get("/login")

  def _post(self, data):
    return self.client.post(
        "/query",
        data=json.dumps(data),
        headers={"Content-Type": "application/json", }
    )

  def _setup_objects(self):
    text_cad = factories.CustomAttributeDefinitionFactory(
        title="text cad",
        definition_type="market",
    )
    date_cad = factories.CustomAttributeDefinitionFactory(
        title="date cad",
        definition_type="market",
        attribute_type="Date",
    )
    self.audit = factories.AuditFactory()
    for i in range(5):
      market = factories.MarketFactory()
      factories.CustomAttributeValueFactory(
          custom_attribute=date_cad,
          attributable=market,
          attribute_value="2016-11-0{}".format(i + 3),
      )
      factories.CustomAttributeValueFactory(
          custom_attribute=text_cad,
          attributable=market,
          attribute_value="2016-11-0{}".format(i + 1),
      )

    revisions = models.Revision.query.filter(
        models.Revision.resource_type == "Market",
        models.Revision.id.in_(
            db.session.query(func.max(models.Revision.id)).group_by(
                models.Revision.resource_type,
                models.Revision.resource_id,
            )
        ),
    )

    self.snapshots = [
        factories.SnapshotFactory(
            child_id=revision.resource_id,
            child_type=revision.resource_type,
            revision=revision,
            parent=self.audit,
        )
        for revision in revisions
    ]
    views.do_reindex()

  def test_basic_snapshot_query(self):
    """Test fetching all snapshots for a given Audit."""
    self._setup_objects()
    result = self._post([
        {
            "object_name": "Snapshot",
            "filters": {
                "expression": self._get_market_expression(),
                "keys": [],
                "order_by": {"keys": [], "order": "", "compare": None}
            }
        }
    ])
    self.assertEqual(len(result.json[0]["Snapshot"]["values"]), 5)

  def _get_market_expression(self):
    return {
        "left": {
            "left": "child_type",
            "op": {"name": "="},
            "right": "Market"
        },
        "op": {"name": "AND"},
        "right": {
            "object_name": "Audit",
            "op": {"name": "relevant"},
            "ids": [self.audit.id]
        }
    }
