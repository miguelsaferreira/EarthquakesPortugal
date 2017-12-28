/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { EarthquakesService } from './services/earthquakes.service';
/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [],
  template: `
    <section class="hero is-primary">
    <div class="hero-head">
        <nav class="main-nav nav has-shadow">
            <div class="container">
                <div class="nav-left">
                    <a class="nav-item" href="#">
                        <h1 class="title is-5">Earthquakes Portugal</h1>
                    </a>
                    <a class="nav-item " href="#">Home</a>

                </div>
            </div>
        </nav>
    </div>
    </section>

    <router-outlet></router-outlet>
    <footer>
    </footer>
  `,
  providers: [EarthquakesService],
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Mean stack starter';
  public url = 'https://mean.io';

  constructor(
    public appState: AppState
  ) { }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
