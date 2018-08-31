import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  /* to use database, must disable "HttpClientInMemoryWebApiModule" in AppModule imports */
  private baseUrl = 'http://localhost:8080/DBForAngular';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  log(msg: string): void {
    this.messageService.add(`HeroService: ${msg}`);
  }

  getHeroes(): Observable<Hero[]> {
    const url = `${this.baseUrl}/heroes`;
    return this.http.get<Hero[]>(url)
              .pipe(
                tap(() => this.log('fetched heroes')),
                catchError(this.handleError('getHeroes', []))
              );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.baseUrl}/heroes/${id}`;
    return this.http.get<Hero>(url)
              .pipe(
                tap(() => this.log(`fetched hero id=${id}`)),
                catchError(this.handleError<Hero>(`getHero id=${id}`))
              );
  }
  // TODO use POST method
  updateHero(hero: Hero): Observable<any> {
    const url = `${this.baseUrl}/update/${hero.id}?name=${hero.name}`;
    return this.http.get(url, {responseType: 'text'})
              .pipe(
                tap(() => this.log(`update hero id=${hero.id}`)),
                catchError(this.handleError<any>('updateHero'))
              );

    // return this.http.put(this.heroesUrl, hero, httpOptions)
    //           .pipe(
    //             tap(() => this.log(`update hero id=${hero.id}`)),
    //             catchError(this.handleError<any>('updateHero'))
    //           );
  }
  // TODO use POST method
  addHero(hero: Hero): Observable<Hero> {

    const url = `${this.baseUrl}/add?name=${hero.name}`;
    return this.http.get<Hero>(url)
              .pipe(
                tap(() => this.log(`added hero id=${hero.id}`)),
                catchError(this.handleError<Hero>('addHero'))
              );

    // return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
    //           .pipe(
    //             tap(() => this.log(`added hero id=${hero.id}`)),
    //             catchError(this.handleError<Hero>('addHero'))
    //           );
  }
  // TODO use POST method
  deleteHero(hero: Hero): Observable<any> {

    const url = `${this.baseUrl}/delete/${hero.id}`;

    return this.http.get(url, {responseType: 'text'})
              .pipe(
                tap(() => this.log(`delete hero id=${hero.id}`)),
                catchError(this.handleError<Hero>('deleteHero'))
              );

    // const id = hero.id;
    // const url = `${this.heroesUrl}/${id}`;

    // return this.http.delete<Hero>(url, httpOptions)
    //           .pipe(
    //             tap(() => this.log(`delete hero id=${hero.id}`)),
    //             catchError(this.handleError<Hero>('deleteHero'))
    //           );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.baseUrl}/search/${term}`)
              .pipe(
                tap(() => this.log(`found heroes matching ${term}`)),
                catchError(this.handleError<Hero[]>(`serachHeroes`, []))
              );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
