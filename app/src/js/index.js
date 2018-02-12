import title from '../partials/title.hbs';

import 'style/index.scss';

const app = document.getElementById('app');

app.innerHTML = title({ title: 'Randall' });
