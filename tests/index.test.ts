import { makeUnit, makeConsecutiveUnits, utx } from '@/index'

describe('utx test', () => {
  test('makeUnit', () => {
    expect(makeUnit(1000, '秒')).toMatchObject({
      base: 1000,
      label: '秒',
    })
  })

  test('makeConsecutiveUnits', () => {
    expect(
      makeConsecutiveUnits([makeUnit(1000, '秒'), makeUnit(60, '分')])
    ).toMatchObject([makeUnit(1000 * 60, '分'), makeUnit(1000, '秒')])
  })

  test('utx', () => {
    expect(
      utx(
        makeConsecutiveUnits([
          makeUnit(1000, (v) => `${v.toString().padStart(2, '0')}sec`),
          makeUnit(60, 'min'),
          makeUnit(60, 'hours'),
        ])
      )(34806519)
    ).toMatchObject(['9hours', '40min', '06sec'])
  })
})
