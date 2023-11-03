import { trigger, transition, query, animate, style, stagger } from '@angular/animations';

export const ANIMATIONS =  [

    // Trigger animation for plus button
    trigger('plusAnimation', [

      // Transition from any state to any state
      transition(':enter', [
        query('.plus-card', style({ opacity: 0, transform: 'translateY(-40px)' }), { optional: true }),
        query('.plus-card', stagger('100ms', [
          animate('1s 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ]), { optional: true }),
      ])
    ])
  ];
