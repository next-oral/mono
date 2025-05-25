import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OrgInviteEmailProps {
  organizationName?: string;
  inviterName?: string;
  inviteLink?: string;
}

export function OrgInviteEmail({
  organizationName = "Next Dental",
  inviterName = "Dr. Jefferson",
  inviteLink = "https://yourapp.com/invite/accept?token=123",
}: OrgInviteEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>You've been invited to join {organizationName}</Preview>
        <Body className="bg-gray-100 font-sans text-gray-800">
          <Container className="mx-auto max-w-[600px] rounded-md bg-white p-6 shadow-md">
            <Section className="text-center">
              <Heading className="text-2xl font-bold text-blue-600">
                You're Invited!
              </Heading>
              <Text className="mt-2 text-lg">
                {inviterName} has invited you to join{" "}
                <strong>{organizationName}</strong> on our platform.
              </Text>
            </Section>

            <Section className="my-6 text-center">
              <Link
                href={inviteLink}
                className="inline-block rounded bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Accept Invitation
              </Link>
              <Text className="mt-4 text-sm text-gray-600">
                This link will expire in 7 days.
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-sm text-gray-500">
              If you were not expecting this invitation, you can safely ignore
              this email.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
