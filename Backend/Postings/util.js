const AccumulateTags = (rows) => {
  if (!rows || rows.length === 0 ) return rows;
  rows = rows.map((row) => ({ ...row, tagname: [row.tagname] }));
  const res = [];
  res.push(rows[0]);
  for (let idx = 1; idx < rows.length; idx++) {
    const row = rows[idx];
    // Same post multiple tags
    if (res[res.length - 1].postid === row.postid) {
      res[res.length - 1].tagname = res[res.length - 1].tagname.concat(
        row.tagname
      );
    } else {
      res.push(row);
    }
  }
  return res;
};

console.log(AccumulateTags([]));
module.exports = { AccumulateTags };
