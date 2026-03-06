import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { fa, aliases as faAliases } from 'vuetify/iconsets/fa'
import { mdi, aliases as mdiAliases } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...mdiAliases,
      ...faAliases,
    },
    sets: {
      fa,
      mdi,
    },
  },
})
