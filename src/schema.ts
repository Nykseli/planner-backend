
import { gql, IResolvers } from 'apollo-server';
import MockData from './mockData';

const mockData = new MockData();

export const typeDefs = gql`
  type Query {
    """
    Tasks on a given date.
    Returns null or empty list if there are no tasks.
    """
    dailyTasks(date: DateInfoInput!): [DailyTask!]!
    """
    Returns a value for each day in the month.
    If value is null, it means there are no tasks.
    """
    monthlyTasks(month: Int, year: Int): [MonthViewTask]!
    montly: String
  }

  type Mutation {
    addDailyTask(task: DailyTaskInput!): DailyTask!
    deleteDailyTask(task: DailyTaskInput!): DailyTask!
    updateDailyTask(task: DailyTaskInput!): DailyTask!
  }

  input MonthInput {
    "The month (1–12)"
    month: Int!
    "The year (4 digits for 4-digit years)"
    year: Int!
  }

  input DailyTaskInput {
    "If id is null, new one is generated"
    id: ID
    "Short title for the task"
    title: String!
    "Longer description for the task"
    description: String!
    "Information of the task's date"
    date: DateInfoInput!
    "Hour when the task starts"
    startHour: Int!
    "Minute when the task starts"
    startMinute: Int!
    "Hour when the task ends"
    endHour: Int!
    "Minute when the task ends"
    endMinute: Int!
  }

  input DateInfoInput {
    "The day of the month (1–31)"
    date: Int!
    "The day of the week (1–7, monday-sunday)"
    weekday: Int!
    "The month (1–12)"
    month: Int!
    "The year (4 digits for 4-digit years)"
    year: Int!
  }

  type DailyTask {
    id: ID!
    "Short title for the task"
    title: String!
    "Longer description for the task"
    description: String!
    "Information of the task's date"
    date: DateInfo!
    "Hour when the task starts"
    startHour: Int!
    "Minute when the task starts"
    startMinute: Int!
    "Hour when the task ends"
    endHour: Int!
    "Minute when the task ends"
    endMinute: Int!
  }

  type DateInfo {
    "The day of the month (1–31)"
    date: Int!
    "The day of the week (1–7, monday-sunday)"
    weekday: Int!
    "The month (1–12)"
    month: Int!
    "The year (4 digits for 4-digit years)"
    year: Int!
  }

  type MonthViewTask {
    taskCount: Int
  }
`;

export const resolvers: IResolvers = {
  Query: {
    dailyTasks: (parent, args, context, info) => {
      return mockData.getDailyTasks(args.date);
    },
    monthlyTasks: (parent, args, context, info) => {
      return mockData.getMonthlyTasks(args.month, args.year);
    }
  },
  Mutation: {
    updateDailyTask: (parent, args, context, info) => {
      return mockData.updateDailyTask(args.task);
    },
    addDailyTask: (parent, args, context, info) => {
      return mockData.addDailyTask(args.task);
    },
    deleteDailyTask: (parent, args, context, info) => {
      return mockData.deleteDailyTask(args.task);
    },
  }
};
