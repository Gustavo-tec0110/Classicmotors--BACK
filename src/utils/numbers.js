function optionalNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalInteger(value) {
  const parsed = optionalNumber(value);
  return Number.isInteger(parsed) ? parsed : null;
}

module.exports = { optionalInteger, optionalNumber };
