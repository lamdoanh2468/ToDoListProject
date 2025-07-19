"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var db = require("../config/dbConnection");

var getAllTasks = function getAllTasks(req, res) {
  var _ref, _ref2, rows, fields;

  return regeneratorRuntime.async(function getAllTasks$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.query("\n           SELECT \n            t.id AS task_id,\n            t.title,\n            t.description,\n            t.completed,\n            t.deadline,\n            t.created_at,\n            t.updated_at,\n            u.first_name,\n            u.last_name,\n            p.name AS priority_name,\n            p.color AS priority_color,\n            GROUP_CONCAT(DISTINCT tg.name) AS tags,\n            GROUP_CONCAT(DISTINCT a.file_url) AS attachments\n            FROM tasks t\n            LEFT JOIN users u ON t.user_id = u.id\n            LEFT JOIN priority_levels p ON t.priority_id = p.id\n            LEFT JOIN task_tag tt ON t.id = tt.task_id\n            LEFT JOIN tags tg ON tt.tag_id = tg.id\n            LEFT JOIN attachments a ON t.id = a.task_id\n            GROUP BY t.id\n            ORDER BY t.deadline ASC;\n            "));

        case 3:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          rows = _ref2[0];
          fields = _ref2[1];
          res.status(200).json({
            success: true,
            data: rows
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("Error on fetching tasks", _context.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  getAllTasks: getAllTasks
};