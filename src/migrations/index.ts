import * as migration_20250428_161252 from './20250428_161252';
import * as migration_fix_main_cta_id_integer from './fix-main-cta-id-integer';
import * as migration_fix_platform_name_enum from './fix-platform-name-enum';

export const migrations = [
  {
    up: migration_20250428_161252.up,
    down: migration_20250428_161252.down,
    name: '20250428_161252',
  },
  {
    up: migration_fix_main_cta_id_integer.up,
    down: migration_fix_main_cta_id_integer.down,
    name: 'fix-main-cta-id-integer',
  },
  {
    up: migration_fix_platform_name_enum.up,
    down: migration_fix_platform_name_enum.down,
    name: 'fix-platform-name-enum'
  },
];
