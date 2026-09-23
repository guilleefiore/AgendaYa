const fs = require('fs');
const file = 'src/TimezoneBooking.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(\!tzs\.includes\(localTz\)\) \{\s*setTzs\(prev => \[\.\.\.prev, localTz\]\);\s*\}/g,
  `setTzs(prev => prev.includes(localTz) ? prev : [...prev, localTz]);`
);

fs.writeFileSync(file, code);
