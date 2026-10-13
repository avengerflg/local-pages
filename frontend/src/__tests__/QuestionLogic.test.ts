import { 
  isQuestionVisible, 
  isQuestionAnswered, 
  parseConditionalRule,
  getOptionLabel,
  getOptionValue
} from '../lib/question-logic';
import { ServiceQuestion } from '../types/api';

describe('Question Logic & Conditional Rules', () => {
  const allQuestions: ServiceQuestion[] = [
    {
      id: 1,
      service_id: 10,
      question_text: 'Do you have pets?',
      question_type: 'single_choice',
      required: true,
      sort_order: 1,
      conditional_rule: null,
      options: [
        { id: 101, question_id: 1, label: 'Yes', value: 'yes', sort_order: 1 },
        { id: 102, question_id: 1, label: 'No', value: 'no', sort_order: 2 },
      ],
    },
    {
      id: 2,
      service_id: 10,
      question_text: 'What kind of pets?',
      question_type: 'text',
      required: true,
      sort_order: 2,
      conditional_rule: {
        depends_on_question_id: 1,
        selected_option_id: 101,
      },
    },
    {
      id: 3,
      service_id: 10,
      question_text: 'Which rooms have pets?',
      question_type: 'multiple_choice',
      required: false,
      sort_order: 3,
      conditional_rule: {
        parent_question_id: 1,
        parent_option_id: 101,
      },
      options: [
        { id: 201, question_id: 3, label: 'Living Room', value: 'living', sort_order: 1 },
        { id: 202, question_id: 3, label: 'Bedroom', value: 'bed', sort_order: 2 },
      ],
    },
    {
      id: 4,
      service_id: 10,
      question_text: 'Special requirements for bedrooms',
      question_type: 'text',
      required: false,
      sort_order: 4,
      conditional_rule: {
        depends_on_question_id: 3,
        selected_option_id: 202,
      },
    },
    {
      id: 5,
      service_id: 10,
      question_text: 'Urgent reason',
      question_type: 'text',
      required: true,
      sort_order: 5,
      conditional_rule: {
        depends_on_question_id: 1,
        value: 'yes',
      },
    },
  ];

  describe('parseConditionalRule', () => {
    it('returns null for null, empty or undefined', () => {
      expect(parseConditionalRule(null)).toBeNull();
      expect(parseConditionalRule(undefined)).toBeNull();
      expect(parseConditionalRule('')).toBeNull();
    });

    it('returns object if already parsed', () => {
      const rule = { depends_on_question_id: 1, selected_option_id: 101 };
      expect(parseConditionalRule(rule)).toEqual(rule);
    });

    it('parses valid JSON string', () => {
      const jsonStr = '{"depends_on_question_id":1,"selected_option_id":101}';
      expect(parseConditionalRule(jsonStr)).toEqual({
        depends_on_question_id: 1,
        selected_option_id: 101,
      });
    });

    it('returns null on invalid JSON string', () => {
      expect(parseConditionalRule('invalid json')).toBeNull();
    });
  });

  describe('isQuestionVisible', () => {
    it('returns true for question without conditional rule', () => {
      expect(isQuestionVisible(allQuestions[0], {}, allQuestions)).toBe(true);
    });

    it('returns false for child question when parent is not answered', () => {
      expect(isQuestionVisible(allQuestions[1], {}, allQuestions)).toBe(false);
    });

    it('returns false when parent is answered with a non-matching option', () => {
      const answers = {
        1: { question_id: 1, selected_option_id: 102 }, // "No"
      };
      expect(isQuestionVisible(allQuestions[1], answers, allQuestions)).toBe(false);
    });

    it('returns true when parent is answered with the matching option ID', () => {
      const answers = {
        1: { question_id: 1, selected_option_id: 101 }, // "Yes"
      };
      expect(isQuestionVisible(allQuestions[1], answers, allQuestions)).toBe(true);
      expect(isQuestionVisible(allQuestions[2], answers, allQuestions)).toBe(true); // uses parent_option_id
    });

    it('returns true for multiple choice parent containing expected option ID in structured_value', () => {
      const answers = {
        3: { question_id: 3, structured_value: [201, 202] }, // Living and Bedroom
      };
      expect(isQuestionVisible(allQuestions[3], answers, allQuestions)).toBe(true);

      const answersOnlyLiving = {
        3: { question_id: 3, structured_value: [201] },
      };
      expect(isQuestionVisible(allQuestions[3], answersOnlyLiving, allQuestions)).toBe(false);
    });

    it('evaluates value-based conditional rules via answer_text or option value', () => {
      // Direct text match
      const textAnswers = {
        1: { question_id: 1, answer_text: 'Yes' },
      };
      expect(isQuestionVisible(allQuestions[4], textAnswers, allQuestions)).toBe(true);

      // Selected option match where option has value 'yes'
      const optionAnswers = {
        1: { question_id: 1, selected_option_id: 101 }, // option 101 value is 'yes'
      };
      expect(isQuestionVisible(allQuestions[4], optionAnswers, allQuestions)).toBe(true);
    });
  });

  describe('isQuestionAnswered', () => {
    it('checks single_choice questions', () => {
      const q = allQuestions[0];
      expect(isQuestionAnswered(q, undefined)).toBe(false);
      expect(isQuestionAnswered(q, { question_id: 1, selected_option_id: null })).toBe(false);
      expect(isQuestionAnswered(q, { question_id: 1, selected_option_id: 101 })).toBe(true);
    });

    it('checks multiple_choice questions', () => {
      const q = allQuestions[2];
      expect(isQuestionAnswered(q, undefined)).toBe(false);
      expect(isQuestionAnswered(q, { question_id: 3, structured_value: [] })).toBe(false);
      expect(isQuestionAnswered(q, { question_id: 3, structured_value: [201] })).toBe(true);
    });

    it('checks text questions', () => {
      const q = allQuestions[1];
      expect(isQuestionAnswered(q, undefined)).toBe(false);
      expect(isQuestionAnswered(q, { question_id: 2, answer_text: '   ' })).toBe(false);
      expect(isQuestionAnswered(q, { question_id: 2, answer_text: 'Golden Retriever' })).toBe(true);
    });

    it('checks file_upload and image_upload questions satisfied by attachmentsCount', () => {
      const qFile: ServiceQuestion = {
        id: 10,
        service_id: 1,
        question_text: 'Photos',
        question_type: 'file_upload',
        required: true,
        sort_order: 1,
        conditional_rule: null,
      };
      expect(isQuestionAnswered(qFile, undefined, 0)).toBe(false);
      expect(isQuestionAnswered(qFile, undefined, 2)).toBe(true);
    });
  });

  describe('option labels and values helpers', () => {
    it('returns label or fallback', () => {
      expect(getOptionLabel({ id: 1, question_id: 1, label: 'House', sort_order: 1 })).toBe('House');
      expect(getOptionLabel({ id: 2, question_id: 1, option_text: 'Apartment', sort_order: 2 })).toBe('Apartment');
      expect(getOptionLabel({ id: 3, question_id: 1, value: 'unit', sort_order: 3 })).toBe('unit');
    });

    it('returns value or fallback', () => {
      expect(getOptionValue({ id: 1, question_id: 1, value: 'house', sort_order: 1 })).toBe('house');
      expect(getOptionValue({ id: 2, question_id: 1, label: 'Apartment', sort_order: 2 })).toBe('Apartment');
    });
  });
});
