/**
 * Classes are copied from the planner
 */
// Number representation of dates in month
type DateNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
// Number representation of months
type MonthNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
// Number representation of week days (monday - sunday)
type WeekNum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
// Year number for consistency
type YearNum = number;

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Return 0 padded string if number < 10
 *
 * eg  8 => "08"
 *    10 => "10"
 */
const timeDateFmt = (td: number): string => {
  return `${td < 10 ? '0' + td : td}`;
}

/**
 * In js Date object, week days are from 0 to 6
 * and WeekNum is 1 to 7
 */
const jsWeekDayToWeekNum = (day: number): WeekNum => {
  let weekday = day;
  if (weekday == 0)
    weekday = 7;

  return weekday as WeekNum;
}


abstract class Serializable<I> {
  public abstract serialize(): I;
  // TypeScript doesn't allow static abstracts but every child class
  // should implement deSerialize like this
  // public static abstarct deSerialize(obj: I): O;
}

export interface IDateInfo {
  // The day of the month (1–31)
  date: DateNum;
  // The day of the week (1–7, monday-sunday)
  weekday: WeekNum;
  // The month (1–12)
  month: MonthNum;
  // The year (4 digits for 4-digit years)
  year: YearNum;
}

export class DateInfo implements IDateInfo, Serializable<IDateInfo> {
  // The day of the month (1–31)
  public date: DateNum;
  // The day of the week (1–7, monday-sunday)
  public weekday: WeekNum;
  // The month (1–12)
  public month: MonthNum;
  // The year (4 digits for 4-digit years)
  public year: YearNum;

  constructor(date: DateNum, weekday: WeekNum, month: MonthNum, year: YearNum) {
    this.date = date;
    this.weekday = weekday;
    this.month = month;
    this.year = year;
  }

  public serialize(): IDateInfo {
    return { ...this } as IDateInfo;
  }

  public static deSerialize(iDate: IDateInfo): DateInfo {
    return new DateInfo(iDate.date, iDate.weekday, iDate.month, iDate.year);
  }

  public static toString(date: IDateInfo): string {
    const d = timeDateFmt(date.date);
    const m = timeDateFmt(date.month);

    return `${d}.${m}.${date.year}`
  }

  public static fromDate(date: Date): DateInfo {
    const d = date.getDate() as DateNum;
    const weekday = jsWeekDayToWeekNum(date.getDay());
    // getMonth returns (0-11) and we want (1-12)
    const month = date.getMonth() + 1 as MonthNum;
    const year = date.getFullYear() as YearNum;

    return new DateInfo(d, weekday, month, year);
  }

  public static equal(date1: IDateInfo, date2: IDateInfo) {
    return date1.date == date2.date
      && date1.month == date2.month
      && date1.year == date2.year;
  }

  /**
   * Get the current local date
   */
  public static today(): DateInfo {
    const date = new Date();
    return DateInfo.fromDate(date);
  }

  /**
   * Next date relative to a date
   */
  public static toNextDay(date: IDateInfo): DateInfo {
    // Javascript maps months 0-11 and we map them 1-12
    const nextDay = new Date(date.year, date.month - 1, date.date);
    nextDay.setDate(nextDay.getDate() + 1);
    return DateInfo.fromDate(nextDay);
  }

  /**
   * Previous date relative to a date
   */
  public static toPreviousDay(date: IDateInfo): DateInfo {
    // Javascript maps months 0-11 and we map them 1-12
    const nextDay = new Date(date.year, date.month - 1, date.date);
    nextDay.setDate(nextDay.getDate() - 1);
    return DateInfo.fromDate(nextDay);
  }

  /**
   * Create a DateInfo from the month defined by dayInMonth.
   *
   * Setting dayInMonth higher than the days in the current month
   * should be considered as undefined behavior.
   */
  public static fromMonth(month: IMonthInfo, dayInMonth: DateNum) {
    // Javascript maps months 0-11 and we map them 1-12
    const nextDay = new Date(month.year, month.month - 1, dayInMonth);
    return DateInfo.fromDate(nextDay);
  }
}

export interface IMonthInfo {
  // Which day of the week is the first day of the month
  // (1–7, monday-sunday)
  startWeekday: WeekNum;
  // Which day of the week is the last day of the month
  endWeekday: WeekNum;
  // Which is the last date (28-31) is the last of the month
  endDate: MonthNum;
  // The month (1–12)
  month: MonthNum;
  // The year (4 digits for 4-digit years)
  year: YearNum;
}

export class MonthInfo implements IMonthInfo, Serializable<IMonthInfo> {
  // Which day of the week is the first day of the month
  // (1–7, monday-sunday)
  public startWeekday: WeekNum;
  // Which day of the week is the last day of the month
  public endWeekday: WeekNum;
  // Which is the last date (28-31) is the last of the month
  public endDate: MonthNum;
  // First day is always 1
  public static readonly firstDay: WeekNum = 1;
  // The month (1–12)
  public month: MonthNum;
  // The year (4 digits for 4-digit years)
  public year: YearNum;


  constructor(
    year: YearNum,
    month: MonthNum,
    endDate: MonthNum,
    endWeekday: WeekNum,
    startWeekday: WeekNum,
  ) {
    this.year = year;
    this.month = month;
    this.endDate = endDate;
    this.endWeekday = endWeekday;
    this.startWeekday = startWeekday;
  }

  /**
  * List of numbers between 1 and endDate. Inclusive
  */
  public dateList(): Array<DateNum> {
    return Array.from({ length: this.endDate }, (_v, k) => (k + 1) as DateNum);
  }

  public isSunday(date: number): boolean {
    if (this.startWeekday === 1)
      return date % 7 === 0;

    return date % 7 === 8 - this.startWeekday;
  }

  public isInFirstWeek(date: number): boolean {
    const daysInFirstWeek = 8 - this.startWeekday;
    return date <= daysInFirstWeek;
  }

  public isToday(date: number, cDate: IDateInfo): boolean {
    return date === cDate.date
      && this.year === cDate.year
      && this.month === cDate.month;
  }

  public serialize(): IMonthInfo {
    return { ...this } as IMonthInfo;
  }

  public static deSerialize(iMonth: IMonthInfo): MonthInfo {
    return new MonthInfo(
      iMonth.year,
      iMonth.month,
      iMonth.endDate,
      iMonth.endWeekday,
      iMonth.startWeekday
    );
  }

  public static fromDate(date: Date): MonthInfo {
    const m = date.getMonth();
    const y = date.getFullYear();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const startWeekday = jsWeekDayToWeekNum(firstDay.getDay());
    const endWeekday = jsWeekDayToWeekNum(lastDay.getDay());
    const endDate = lastDay.getDate() as MonthNum;
    const year = y as YearNum;
    // getMonth returns (0-11) and we want (1-12)
    const month = m + 1 as MonthNum;

    return new MonthInfo(year, month, endDate, endWeekday, startWeekday);
  }

  /**
   * Get the current local date
   */
  public static thisMonth(): MonthInfo {
    const date = new Date();
    return MonthInfo.fromDate(date);
  }

  /**
   * Next month relative to a month
   */
  public static toNextMonth(month: IMonthInfo): MonthInfo {
    // Javascript maps monts 0-11 and we map them 1-12
    const nextMonth = new Date(month.year, month.month - 1, 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return MonthInfo.fromDate(nextMonth);
  }

  /**
   * Previous month relative to a month
   */
  public static toPreviousMonth(date: IMonthInfo): MonthInfo {
    // Javascript maps monts 0-11 and we map them 1-12
    const nextMonth = new Date(date.year, date.month - 1, 1);
    nextMonth.setMonth(nextMonth.getMonth() - 1);
    return MonthInfo.fromDate(nextMonth);
  }
}

/**
 * Contains data that's needed to display the daily task information in
 * MonthlyViewScreen days
 */
export interface IMonthViewTask {
  taskCount: number
}

/**
 * Contains data that's needed to display the daily task information
 * in DailyViewScreen
 */
export interface IDailyTask {
  // Unique task indentifier
  id: number;
  title: string,
  description: string,
  date: IDateInfo,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
}

export class DailyTask implements IDailyTask, Serializable<IDailyTask> {
  public id: number;
  public title: string;
  public description: string;
  public date: IDateInfo;
  public startHour: number;
  public startMinute: number;
  public endHour: number;
  public endMinute: number;

  // Temporarily generate id's with this.
  // This can be removed when we get the ids from the backend.
  private static uniqueId: number = 1;
  public static genId = (): number => {
    return DailyTask.uniqueId++;
  }

  constructor(title: string,
    description: string,
    date: IDateInfo,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ) {
    this.id = DailyTask.genId();
    this.title = title;
    this.description = description;
    this.date = date;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.endHour = endHour;
    this.endMinute = endMinute;
  }

  public serialize(): IDailyTask {
    return { ...this } as IDailyTask;
  }

  /**
   * Create a new DailyTask object with current empty strings and current time.
   * Initial start hour is next hour and end hour is one hour that.
   * startMinute and endMinute is always 0
   */
  public static new(): DailyTask {
    const today = DateInfo.today().serialize();
    const date = new Date();

    return new DailyTask("", "", today, date.getHours() + 1, 0, date.getHours() + 2, 0);
  }
}


export interface DailyTasks { [date: number]: IDailyTask[] }
export interface MonthTasks { [month: number]: DailyTasks }
export interface YearlyTasks { [year: number]: MonthTasks }
export interface TasksById { [id: number]: IDailyTask }

export default class MockData {

  // Contains all the tasks that exists in the database
  private yearlyTasks: YearlyTasks;
  private tasksById: TasksById;

  constructor() {
    this.genData();
  }

  public getDailyTasks(date: IDateInfo): IDailyTask[] {
    if (!this.yearlyTasks[date.year] || !this.yearlyTasks[date.year][date.month])
      return [];
    return this.yearlyTasks[date.year][date.month][date.date] || [];
  }

  public getMonthlyTasks(month: number, year: number): IMonthViewTask[] | null[] {
    const mInfo = MonthInfo.fromDate(new Date(year, month));
    const tasks = [];

    if (!this.yearlyTasks[year] || !this.yearlyTasks[year][month]) {
      for (let i = 1; i <= mInfo.endDate; i++) {
        tasks.push(null);
      }
    } else {
      for (let i = 1; i <= mInfo.endDate; i++) {
        const t = this.yearlyTasks[year][month][i];
        if (t === undefined) {
          tasks.push(null);
        } else {
          tasks.push({ taskCount: t.length });
        }
      }
    }

    return tasks;
  }

  public updateDailyTask(task: IDailyTask): IDailyTask {
    // TODO: make sure tasks actually exists before update
    //       and return error if it doesn't
    const origTask = this.tasksById[task.id];
    if (!DateInfo.equal(origTask.date, task.date)) {
      this.dateExists(task.date.year, task.date.month, task.date.date);
      this.yearlyTasks[task.date.year][task.date.month][task.date.date].push(task);
      const tArr = this.yearlyTasks[origTask.date.year][origTask.date.month][origTask.date.date];
      for (let i = 0; i < tArr.length; i++) {
        if (tArr[i].id == origTask.id) {
          this.yearlyTasks[origTask.date.year][origTask.date.month][origTask.date.date].splice(i, 1);
        }
      }
    } else {
      const tArr = this.yearlyTasks[origTask.date.year][origTask.date.month][origTask.date.date];
      for (let i = 0; i < tArr.length; i++) {
        if (tArr[i].id == origTask.id) {
          this.yearlyTasks[origTask.date.year][origTask.date.month][origTask.date.date][i] = task;
        }
      }
    }

    return task;
  }

  public addDailyTask(task: IDailyTask): IDailyTask {
    this.dateExists(task.date.year, task.date.month, task.date.date);
    task.id = DailyTask.genId();
    this.yearlyTasks[task.date.year][task.date.month][task.date.date].push(task);
    this.tasksById[task.id] = task;
    return task;
  }

  public deleteDailyTask(task: IDailyTask): IDailyTask {
    // TODO: make sure tasks actually exists before delete
    //       and return error if it doesn't
    const tArr = this.yearlyTasks[task.date.year][task.date.month][task.date.date];
    for (let i = 0; i < tArr.length; i++) {
      if (tArr[i].id == task.id) {
        this.yearlyTasks[task.date.year][task.date.month][task.date.date].splice(i, 1);
      }
    }
    delete this.tasksById[task.id];

    return task;
  }

  /**
   * Initialize date if it doesn't exist in "db"
   */
  private dateExists(year: number, month: number, date: number) {
    if (this.yearlyTasks[year] === undefined)
      this.yearlyTasks[year] = {};
    if (this.yearlyTasks[year][month] === undefined)
      this.yearlyTasks[year][month] = {};
    if (this.yearlyTasks[year][month][date] === undefined)
      this.yearlyTasks[year][month][date] = [];
  }

  // Gen data for previous, this and next month
  private genData(): void {
    const tM = MonthInfo.thisMonth();
    const nM = MonthInfo.toNextMonth(tM);
    const pM = MonthInfo.toPreviousMonth(tM);

    this.yearlyTasks = {};
    this.tasksById = {};
    for (let m of [tM, nM, pM]) {
      /* if (this.yearlyTasks[m.year] === undefined)
        this.yearlyTasks[m.year] = {};
      if (this.yearlyTasks[m.year][m.month] === undefined)
        this.yearlyTasks[m.year][m.month] = {}; */
      for (let d = 1; d <= m.endDate; d++) {
        this.dateExists(m.year, m.month, d);
        /* if (this.yearlyTasks[m.year][m.month][d] === undefined)
          this.yearlyTasks[m.year][m.month][d] = []; */
        const tasks = this.randomTaskCount();
        for (let i = 0; i < tasks; i++) {
          const c = this.randomDailyTask((DateInfo.fromMonth(m, d as DateNum).serialize()));
          this.yearlyTasks[m.year][m.month][d].push(c);
          this.tasksById[c.id] = c;
        }
      }
    }
  }

  private randomDailyTask(date: IDateInfo): IDailyTask {
    const sHour = this.randomHour(0, 22);
    const sMinute = this.randomMinute();
    const eHour = this.randomHour(sHour, 23);
    const eMinute = this.randomMinute();
    const title = this.randomTitle(date);
    const description = this.randomDescription(date);

    return new DailyTask(title, description, date, sHour, sMinute, eHour, eMinute).serialize();
  }

  private randomTitle(date: IDateInfo): string {
    return `Title(${randomNumber(1, 100)}): ${DateInfo.toString(date)}`;
  }

  private randomDescription(date: IDateInfo): string {
    return `This day: ${DateInfo.toString(date)}. Has this following description for you to enjoy! (${randomNumber(1, 100)})`;
  }

  private randomHour(s: number, e: number): number {
    return randomNumber(s, e);
  }

  private randomMinute(): number {
    return randomNumber(0, 59);
  }

  // Define how many tasks a day has 0 - 15
  private randomTaskCount(): number {
    return randomNumber(0, 15);
  }
}
