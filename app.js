require('dotenv').config()

const express = require('express');
const app = express();
const path = require('path')
const port = 3000;

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom');

// const initApi = req => {
//   return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//     req
//   })
// }
const initApi = async (req) => {
  try {
    const api = await Prismic.api(process.env.PRISMIC_ENDPOINT, {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      req,
    });
    return api;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




const handleLinkResolver = doc => {
  // if (doc.type === 'page'){
  //   return '/page' + doc.uid;
  // } else if (doc.type === 'blog_post'){
  //   return '/blog' + doc.uid;
  // }
  return '/'
}

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  };
  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/about', async (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then(response => {
      const { results } = response
      const [meta, about] = results

      // console.log(meta, about);

      res.render('pages/about', {
        about,
        meta
      })
    })
  })
})


app.get("/", (req, res) => {
  res.render('pages/home');
});

app.get("/collections", (req, res) => {
  res.render('pages/collections');
});

app.get("/detail/:uid", (req, res) => {
  res.render('pages/detail');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
