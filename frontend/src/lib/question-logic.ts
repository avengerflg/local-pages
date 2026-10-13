import { 
  ServiceQuestion, 
  ServiceQuestionOption, 
  ConditionalRule 
} from '@/types/api';

export interface FormAnswer {
  question_id: number;
  selected_option_id?: number | null;
  answer_text?: string | null;
  structured_value?: (string | number)[] | null;
}

/**
 * Safely parse a conditional rule whether it was stored as an object or a JSON string.
 */
export function parseConditionalRule(rule: ConditionalRule | string | null | undefined): ConditionalRule | null {
  if (!rule) return null;
  if (typeof rule === 'string') {
    try {
      const parsed = JSON.parse(rule);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as ConditionalRule;
      }
    } catch {
      return null;
    }
    return null;
  }
  if (typeof rule === 'object') {
    return rule;
  }
  return null;
}

/**
 * Evaluates whether a question should be visible based on its conditional rule
 * and the currently submitted/entered answers, matching the exact backend semantics of
 * App\Actions\ServiceRequest\CreateServiceRequestAction::isQuestionApplicable.
 */
export function isQuestionVisible(
  question: ServiceQuestion,
  answers: Record<number, FormAnswer>,
  allQuestions: ServiceQuestion[]
): boolean {
  const rule = parseConditionalRule(question.conditional_rule);
  if (!rule) {
    return true;
  }

  // Determine parent question ID
  const parentQuestionId = rule.depends_on_question_id ?? rule.parent_question_id;
  if (!parentQuestionId) {
    return true;
  }

  const parentAnswer = answers[parentQuestionId];
  if (!parentAnswer) {
    return false;
  }

  // Condition 1: Expected option ID match
  const expectedOptionId = rule.selected_option_id ?? rule.parent_option_id;
  if (expectedOptionId !== undefined && expectedOptionId !== null) {
    // Check single choice selection
    if (
      parentAnswer.selected_option_id !== undefined &&
      parentAnswer.selected_option_id !== null &&
      Number(parentAnswer.selected_option_id) === Number(expectedOptionId)
    ) {
      return true;
    }

    // Check multiple choice structured_value
    if (parentAnswer.structured_value && Array.isArray(parentAnswer.structured_value)) {
      const numbers = parentAnswer.structured_value.map((v) => Number(v));
      if (numbers.includes(Number(expectedOptionId))) {
        return true;
      }
    }

    return false;
  }

  // Condition 2: Expected value string match
  if (rule.value !== undefined && rule.value !== null) {
    const expectedValue = String(rule.value).toLowerCase().trim();

    // Check answer_text
    const actualText = String(parentAnswer.answer_text || '').toLowerCase().trim();
    if (actualText === expectedValue) {
      return true;
    }

    // Check selected option value if available
    if (parentAnswer.selected_option_id) {
      const parentQ = allQuestions.find((q) => q.id === parentQuestionId);
      if (parentQ && parentQ.options) {
        const selectedOpt = parentQ.options.find(
          (opt) => Number(opt.id) === Number(parentAnswer.selected_option_id)
        );
        if (selectedOpt) {
          const optVal = String(
            selectedOpt.value || selectedOpt.label || selectedOpt.option_text || ''
          ).toLowerCase().trim();
          if (optVal === expectedValue) {
            return true;
          }
        }
      }
    }

    return false;
  }

  return true;
}

/**
 * Checks whether an answer is considered provided for a required question.
 */
export function isQuestionAnswered(
  question: ServiceQuestion,
  answer: FormAnswer | undefined,
  attachmentsCount = 0
): boolean {
  // If file/image upload question, presence of global attachments satisfies it
  if (
    question.question_type === 'file_upload' ||
    question.question_type === 'image_upload'
  ) {
    if (attachmentsCount > 0) return true;
  }

  if (!answer) return false;

  // Single choice
  if (
    answer.selected_option_id !== undefined &&
    answer.selected_option_id !== null &&
    answer.selected_option_id > 0
  ) {
    return true;
  }

  // Multiple choice
  if (
    answer.structured_value &&
    Array.isArray(answer.structured_value) &&
    answer.structured_value.length > 0
  ) {
    return true;
  }

  // Text / description
  if (
    typeof answer.answer_text === 'string' &&
    answer.answer_text.trim().length > 0
  ) {
    return true;
  }

  return false;
}

/**
 * Helper to get user-friendly label from an option.
 */
export function getOptionLabel(option: ServiceQuestionOption): string {
  return option.label || option.option_text || option.value || `Option #${option.id}`;
}

/**
 * Helper to get value string from an option.
 */
export function getOptionValue(option: ServiceQuestionOption): string {
  return option.value || option.label || option.option_text || String(option.id);
}
