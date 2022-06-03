import {createCanvas} from 'canvas';
import Profile from '../../models/Profile';
import Size from '../../models/Size';
import buildTreeMap from './buildTreeMap';
import drawTreeMap from './drawTreeMap';

describe('drawTreeMap', () => {
  interface TestCase {
    description: string;
    profile: Profile;
  }

  const testCases: TestCase[] = [
    {description: 'empty profile', profile: {name: 'root', duration_ns: 0}},
    {
      description: 'single task',
      profile: {
        name: 'root',
        duration_ns: 100,
        children: [
          {
            name: 'A',
            duration_ns: 100,
          },
        ],
      },
    },
    {
      description: 'several tasks',
      profile: {
        name: 'root',
        duration_ns: 300,
        children: [
          {
            name: 'A',
            duration_ns: 100,
          },
          {
            name: 'B',
            duration_ns: 200,
          },
        ],
      },
    },
    {
      description: 'long task name',
      profile: {
        name: 'root',
        duration_ns: 300,
        children: [
          {
            name: 'long long long long long task name',
            duration_ns: 100,
          },
          {
            name: 'B',
            duration_ns: 200,
          },
        ],
      },
    },
    {
      description: 'task nesting',
      profile: {
        name: 'root',
        duration_ns: 300,
        children: [
          {
            name: 'A',
            duration_ns: 100,
          },
          {
            name: 'B',
            duration_ns: 200,
            children: [
              {
                name: 'B-A',
                duration_ns: 50,
              },
              {
                name: 'B-B',
                duration_ns: 150,
              },
            ],
          },
        ],
      },
    },
    {
      description: 'very small task',
      profile: {
        name: 'root',
        duration_ns: 100,
        children: [
          {
            name: 'A',
            duration_ns: 99,
          },
          {
            name: 'B',
            duration_ns: 1,
          },
        ],
      },
    },
    {
      description: 'complex',
      profile: {
        name: 'root',
        duration_ns: 1000,
        children: [
          {
            name: 'A',
            duration_ns: 750,
            children: [
              {
                name: 'A-A',
                duration_ns: 300,
                children: [
                  {
                    name: 'A-A-A',
                    duration_ns: 200,
                  },
                  {
                    name: 'A-A-B',
                    duration_ns: 100,
                  },
                ],
              },
              {
                name: 'A-B',
                duration_ns: 450,
              },
            ],
          },
          {
            name: 'B',
            duration_ns: 250,
            children: [
              {
                name: 'B-A',
                duration_ns: 125,
              },
              {
                name: 'B-B',
                duration_ns: 125,
              },
            ],
          },
        ],
      },
    },
  ];

  testCases.forEach((tc) => {
    it(tc.description, () => {
      const canvasSize: Size = {width: 500, height: 400};
      const canvas = createCanvas(canvasSize.width, canvasSize.height);
      const ctx = canvas.getContext('2d');

      const data = buildTreeMap(tc.profile, canvasSize);
      drawTreeMap(ctx, data, canvasSize);

      expect(canvas.toBuffer()).toMatchImageSnapshot();
    });
  });
});
