process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Product = require('../app/models/product.model.js');
var Category = require('../app/models/category.model.js');

var should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {

  Product.collection.drop();

  beforeEach(done => {
    async function createProduct() {
      const newCategory = new Category({
        name: 'Health',
      });
      const categoryData = await newCategory.save()

      const newProduct = new Product({
        name: 'keyboard',
        categoryId: categoryData.id,
        description: 'fuck you',
        price: 'P100.00',
      });
      const productData = await newProduct.save()

      done();
    }

    createProduct();
  })

  afterEach(done => {
    Category.collection.drop();
    done();
  });

  it('should list ALL products on /products GET', done => {
    chai.request(server)
      .get('/products')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('categoryId');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('price');
        res.body[0].description.should.equal('fuck you');
        res.body[0].price.should.equal('P100.00');
        done();
      });
  });

  it('should add a SINGLE product on /products POST', function (done) {
    async function testProductPOST () {
      const newCategory = new Category({
        name: 'Gaming',
      });
      const categoryData = await newCategory.save();

      chai.request(server)
        .post('/products')
        .send({
          'name': 'mouse',
          'categoryId': categoryData.id,
          'description': 'best gaming mouse',
          'price': 'P999'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('categoryId');
          res.body.should.have.property('description');
          res.body.should.have.property('price');
          res.body.name.should.equal('mouse');
          res.body.categoryId.should.equal(categoryData.id);
          res.body.description.should.equal('best gaming mouse');
          res.body.price.should.equal('P999');
          done();
        });
    }

    testProductPOST();
  });

  it('should list a SINGLE product on /products/:productId GET', done => {
    async function testGetProduct() {
      const newCategory = new Category({
        name: 'Chill',
      })
      const categoryData = await newCategory.save()
      const newProduct = new Product({
        name: 'Lighter',
        categoryId: categoryData.id,
        description: 'even burn',
        price: 'P 999.00',
      });
      const productData = await newProduct.save()
      chai.request(server)
        .put(`/products/${productData._id}`)
        .send({
          'description': 'nice for smoking',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('categoryId');
          res.body.should.have.property('description');
          res.body.should.have.property('price');
          res.body.description.should.equal('nice for smoking');
          done();
        });
    }

    testGetProduct();
  });

  it('should update a SINGLE product on /products/:productId', done => {
    async function testUpdateProduct() {
      const newCategory = new Category({
        name: 'Entertainment',
      });
      const categoryData = await newCategory.save();
      const newProduct = new Product({
        name: 'Telly',
        categoryId: categoryData.id,
        description: 'nice for porm',
        price: 'P 999.00',
      });
      const productData = await newProduct.save();
      const payload = Object.assign({}, productData._doc, { name: 'Bravia XH223' });

      chai.request(server)
        .put(`/products/${productData.id}`)
        .send(payload)
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('name');
          resp.body.should.have.property('_id');
          resp.body.should.have.property('categoryId');
          resp.body.should.have.property('description');
          resp.body.should.have.property('price');
          resp.body._id.should.equal(productData.id);
          resp.body.name.should.equal('Bravia XH223');
          resp.body.categoryId.should.equal(categoryData.id);
          resp.body.description.should.equal('nice for porm');
          resp.body.price.should.equal('P 999.00');
          done();
        });
    }

    testUpdateProduct();
  });
});
