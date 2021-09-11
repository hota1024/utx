export type LabelFormatter = {
  /**
   * returns value formatted string.
   *
   * @param value value.
   */
  (value: number): string
}

export type Unit = {
  /**
   * base number.
   */
  base: number

  /**
   * unit label or label formatter function.
   */
  label: string | LabelFormatter
}

export type UnitFormatOptions = {
  /**
   * if true, ignore the unit of 0.
   */
  noZero?: boolean
}

export type UnitFormatter = {
  /**
   * returns string array formatted in units of value.
   *
   * @param value value.
   * @param options format options.
   */
  (value: number, options?: UnitFormatOptions): string[]
}

export type UnitFactory = {
  /**
   * returns unit by given base and given label.
   *
   * @param base base number.
   * @param label unit label or label formatter function.
   */
  (base: Unit['base'], label: Unit['label']): Unit
}

export const makeUnit: UnitFactory = (base, label) => ({ base, label })

export type ConsecutiveUnitsFactory = {
  /**
   * makes units array into a continuous units array.
   *
   * @param units units array.
   * @example
   * // easy-to-read code
   * makeConsecutiveUnits([makeUnit(1000, 'seconds'), makeUnit(60, 'minutes'), makeUnit(60, 'horus')])
   *                                └──┴─seconds * 60 = minutes┴┴──minutes * 60 = hours─┴┘
   * // hard-to-read code
   * [makeUnit(1000 * 60 * 60, 'hours'), makeUnit(1000 * 60, 'minutes'), makeUnit(1000, 'seconds')]
   *    seconds┴──┘   ├┘   ├┘              seconds┴──┘   ├┘                seconds┴──┘
   *           minutes┘    │                      minutes┘
   *                  hours┘
   */
  (units: Unit[]): Unit[]
}

export const makeConsecutiveUnits: ConsecutiveUnitsFactory = (units) => {
  const r: Unit[] = [units[0]]

  for (const u of units.slice(1)) {
    r.unshift({ ...u, base: u.base * r[0].base })
  }

  return r
}

export type UnitFormatterFactory = {
  /**
   * returns unit formatter function.
   *
   * @param units units array.
   */
  (units: Unit[]): UnitFormatter
}

export const utx: UnitFormatterFactory = (units: Unit[]): UnitFormatter => {
  return (v, options = {}) => {
    const r: string[] = []
    let d = v

    for (const { base, label } of units) {
      const c = Math.floor(d / base)
      d %= base

      if (options.noZero && c === 0) {
        continue
      } else {
        r.push(typeof label === 'string' ? c + label : label(c))
      }
    }

    return r
  }
}
