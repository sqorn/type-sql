import { BOOK } from '../tables/book';
import { ORDER } from '../tables/order';
import { getDB } from '../config/db';

let { db, log } = getDB();

describe('SELECT', () => {
    it('single column', () => {
        db.from(BOOK).select();
        expect(log.sql).toEqual('SELECT * FROM "Book"');
        db.from(BOOK).select(BOOK.$all);
        expect(log.sql).toEqual('SELECT "Book".* FROM "Book"');
        db.from(BOOK).select(BOOK.title);
        expect(log.sql).toEqual('SELECT "Book"."title" FROM "Book"');
        db.from(BOOK).select(BOOK.title.lower());
        expect(log.sql).toEqual('SELECT LOWER("Book"."title") FROM "Book"');
        db.from(BOOK).select(BOOK.$all.count());
        expect(log.sql).toEqual('SELECT COUNT("Book".*) FROM "Book"');
        db.from(BOOK).select(BOOK.price.sum());
        expect(log.sql).toEqual('SELECT SUM("Book"."price") FROM "Book"');
    });

    it('multiple columns', () => {
        db.from(BOOK).select(BOOK.title.lower(), BOOK.author, BOOK.price);
        expect(log.sql).toEqual('SELECT LOWER("Book"."title"), "Book"."author", "Book"."price" FROM "Book"');
        db.from(BOOK).select(BOOK.title, BOOK.$all.count(), BOOK.price.sum());
        expect(log.sql).toEqual('SELECT "Book"."title", COUNT("Book".*), SUM("Book"."price") FROM "Book"');
    });

    it('multiple tables', () => {
        db.from(BOOK, ORDER).select(BOOK.title.lower(), ORDER.quantity, BOOK.price);
        expect(log.sql).toEqual('SELECT LOWER("Book"."title"), "Order"."quantity", "Book"."price" FROM "Book", "Order"');
        db.from(BOOK, ORDER).select(ORDER.quantity.max(), BOOK.$all.count(), BOOK.price.sum());
        expect(log.sql).toEqual('SELECT MAX("Order"."quantity"), COUNT("Book".*), SUM("Book"."price") FROM "Book", "Order"');
        db.from(BOOK, ORDER).select(ORDER.quantity.max(), BOOK.$all);
        expect(log.sql).toEqual('SELECT MAX("Order"."quantity"), "Book".* FROM "Book", "Order"');
    });

    it('"as" keyword', () => {
        db.from(BOOK).select(BOOK.price.sum().as('sum'));
        expect(log.sql).toEqual('SELECT SUM("Book"."price") AS "sum" FROM "Book"');
        db.from(BOOK).select(BOOK.author, BOOK.price.as('pr'));
        expect(log.sql).toEqual('SELECT "Book"."author", "Book"."price" AS "pr" FROM "Book"');
    });

    it('"distinct" keyword', () => {
        db.from(BOOK).distinct().select();
        expect(log.sql).toEqual('SELECT DISTINCT * FROM "Book"');
        db.from(BOOK).distinct().select(BOOK.author);
        expect(log.sql).toEqual('SELECT DISTINCT "Book"."author" FROM "Book"');
    });
});
