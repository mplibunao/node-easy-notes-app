process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Category = require('../app/models/category.model.js');

var should = chai.should();

chai.use(chaiHttp);

describe('Categories', function () {

  Category.collection.drop();

  beforeEach(function (done) {
    var newCategory = new Category({
      name: 'health'
    });
    newCategory.save()
      .then(() => done())
      .catch(err => console.log('err', err));
  });

  afterEach(function (done){
    Category.collection.drop();
    done();
  });

  it('should list ALL categories on /categories GET', function (done) {
    chai.request(server)
      .get('/categories')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('health');
        done();
      });
  });

  it('should add a SINGLE category on /categories POST', function (done) {
    chai.request(server)
      .post('/categories')
      .send({ 'name': 'Java' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        res.body.name.should.equal('Java');
        done();
      });
  });

  it('should list a SINGLE category on /categories/:categoryId GET', function (done) {
    const newCategory = new Category({
      name: 'Gaming'
    })
    newCategory.save(function (err, data) {
      chai.request(server)
        .get(`/categories/${data.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.name.should.equal('Gaming');
          res.body._id.should.equal(data.id);
          done();
        });
    });
  });

  it('should update a SINGLE category on /categories/:categoryId PUT', function (done) {
    const newCategory = new Category({
      name: 'Girls'
    })
    newCategory.save(function (err, data) {
      data.name.should.equal('Girls');

      chai.request(server)
        .put(`/categories/${data.id}`)
        .send({ 'name': 'Home' })
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.should.have.property('_id');
          response.body.name.should.equal('Home');
          done();
        })
    })
  });

  it('should delete a SINGLE category on /categories/:categoryId', done => {
    const newCategory = new Category({
      name: 'Software'
    })
    newCategory.save(function (err, data) {
      data.name.should.equal('Software');

      chai.request(server)
        .delete(`/categories/${data.id}`)
        .end(function (error, response) {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('Category deleted successfully');
          done();
        });
    });
  });
});
