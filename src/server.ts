import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();
const router = new Router();

const mongo = require('koa-mongo');
app.use(mongo({
  host: 'localhost',
  port: 27017,
  user: 'admin',
  pass: '123456',
  db: 'my_db',
  authSource: 'admin',
  max: 100,
  min: 1
}));

app.use(mongo())
app.use(async (ctx, next) => {
  // ctx.db === ctx.mongo.db('test')
  const result = await ctx.db.collection('users').insert({ name: 'haha' })
  const userId = result.ops[0]._id.toString()
  ctx.body = await ctx.db.collection('users').find().toArray()
  ctx.db.collection('users').remove({
    _id: mongo.ObjectId(userId)
  })
})

router.get('/Hello', async (ctx) => {
    ctx.body = 'Hello World!';
});
router.get('/Login', async (ctx) => {
    ctx.body = 'Landing to Login Page';
});
app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');
