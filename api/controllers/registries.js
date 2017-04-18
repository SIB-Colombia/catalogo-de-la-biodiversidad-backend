import jsonfile from 'jsonfile';
const debug = require('debug')('dataportal-api:registries');

/*
  Returns dataportal departments list
 */
function departmentList(req, res) {
  jsonfile.readFile('api/data/department.json', (err, data) => {
    if (err) {
      res.status(400).json({ message: 'Error loading departments data file.' });
    }
    res.json(data.department);
  });
}

/*
  Returns dataportal counties list
 */
function countyList(req, res) {
  jsonfile.readFile('api/data/county.json', (err, data) => {
    if (err) {
      res.status(400).json({ message: 'Error loading counties data file.' });
    }
    res.json(data.counties);
  });
}

module.exports = {
  departmentList,
  countyList
};
